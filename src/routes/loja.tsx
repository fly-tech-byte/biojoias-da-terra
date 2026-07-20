import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { fetchCategories, fetchPublicProducts } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({
  cat: z.string().optional(),
});

export const Route = createFileRoute("/loja")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Loja — Divou Biojoias" },
      { name: "description", content: "Coleção completa de biojoias sustentáveis: colares, brincos, pulseiras e edições limitadas feitos à mão." },
      { property: "og:title", content: "Loja — Divou Biojoias" },
      { property: "og:description", content: "Biojoias artesanais brasileiras." },
    ],
    links: [{ rel: "canonical", href: "/loja" }],
  }),
  component: Loja,
});

function Loja() {
  const { cat } = Route.useSearch();
  const products = useQuery({ queryKey: ["public", "products"], queryFn: () => fetchPublicProducts() });
  const cats = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  useEffect(() => {
    const ch = supabase
      .channel("public-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => products.refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, () => products.refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = cat ? (products.data ?? []).filter((p) => p.categories?.slug === cat) : (products.data ?? []);
  const current = cats.data?.find((c) => c.slug === cat);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container-editorial pt-12 pb-20 flex-1">
        <span className="eyebrow">Loja</span>
        <h1 className="display-serif mt-3 text-5xl md:text-7xl">
          {current ? current.name : "Toda a coleção"}
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          {current?.description ?? "Peças vivas, feitas à mão por comunidades brasileiras."}
        </p>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-border/60 pb-6">
          <CatPill active={!cat} to={{ to: "/loja" } as const} label={`Tudo · ${products.data?.length ?? 0}`} />
          {cats.data?.map((c) => (
            <CatPill
              key={c.slug}
              active={cat === c.slug}
              to={{ to: "/loja", search: { cat: c.slug } } as const}
              label={`${c.name} · ${(products.data ?? []).filter((p) => p.categories?.slug === c.slug).length}`}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {products.isLoading && <p className="text-center text-muted-foreground mt-10">Carregando…</p>}
        {!products.isLoading && list.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            <p>Nenhum produto disponível no momento.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CatPill({ active, to, label }: { active: boolean; to: any; label: string }) {
  return (
    <Link
      {...to}
      className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
