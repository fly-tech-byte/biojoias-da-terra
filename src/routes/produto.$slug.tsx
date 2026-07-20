import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductBySlug, fetchPublicProducts, formatBRL, mainImage } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Truck, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/produto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Divou Biojoias` },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const q = useQuery({ queryKey: ["public", "product", slug], queryFn: () => fetchProductBySlug(slug) });
  const related = useQuery({ queryKey: ["public", "products"], queryFn: () => fetchPublicProducts() });

  useEffect(() => {
    const ch = supabase
      .channel(`product-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => q.refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, () => q.refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (q.isLoading) {
    return <div className="min-h-screen flex flex-col"><Header /><div className="container-editorial py-32 text-center text-muted-foreground">Carregando…</div><Footer /></div>;
  }
  const product = q.data;
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col"><Header />
        <div className="container-editorial py-32 text-center">
          <p>Peça não encontrada.</p>
          <Link to="/loja" className="link-underline mt-4 inline-flex">Voltar à loja</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [...product.product_images].sort((a, b) => {
    if (a.is_main !== b.is_main) return a.is_main ? -1 : 1;
    return a.display_order - b.display_order;
  });
  const main = images[0]?.image_url ?? null;
  const installments = (Number(product.price) / 12).toFixed(2).replace(".", ",");
  const rel = (related.data ?? []).filter((p) => p.categories?.slug === product.categories?.slug && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <Link to="/loja" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> voltar à loja
          </Link>
        </div>

        <section className="container-editorial mt-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[4/5] overflow-hidden rounded-sm bg-muted">
              {main && <img src={main} alt={product.name} className="h-full w-full object-cover" width={1024} height={1280} />}
            </div>
            {images.slice(1, 5).map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-sm bg-muted">
                <img src={img.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="md:col-span-5 md:sticky md:top-24 md:self-start">
            {product.categories && <span className="eyebrow">{product.categories.name}</span>}
            <h1 className="display-serif text-4xl md:text-5xl mt-3">{product.name}</h1>
            <p className="mt-6 text-3xl font-light">{formatBRL(product.price)}</p>
            <p className="text-sm text-muted-foreground">
              ou 12x de R$ {installments} sem juros · 5% off no Pix
            </p>
            {product.stock_quantity === 0 && (
              <p className="mt-2 text-sm text-red-600">Esgotado no momento.</p>
            )}

            <div className="mt-8 space-y-3">
              <button className="btn-primary w-full !py-4 text-base" disabled={product.stock_quantity === 0}>
                {product.stock_quantity === 0 ? "Indisponível" : "Adicionar à sacola"}
              </button>
              <a
                href={`https://wa.me/5561999996850?text=${encodeURIComponent("Olá! Tenho interesse em: " + product.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-ghost w-full !py-4 text-base"
              >
                Comprar pelo WhatsApp
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
              <Detail icon={Truck} title="Envio" text="PAC e Sedex para todo Brasil" />
              <Detail icon={Sparkles} title="Embalagem" text="Caixa reciclada + cartão da peça" />
              <Detail icon={ShieldCheck} title="Garantia" text="Reparos vitalícios" />
            </div>

            <div className="mt-10 space-y-6 text-sm leading-relaxed">
              {product.description && <Block title="Sobre a peça" body={product.description} />}
              {product.origin && <Block title="Origem da semente" body={product.origin} />}
              {product.process && <Block title="Processo artesanal" body={product.process} />}
              {product.meaning && <Block title="Significado cultural" body={product.meaning} />}
            </div>
          </div>
        </section>

        {rel.length > 0 && (
          <section className="container-editorial mt-24">
            <h2 className="display-serif text-3xl mb-8">Você também pode gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {rel.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Detail({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="border border-border/70 rounded-sm p-3">
      <Icon className="h-4 w-4 text-[color:var(--color-clay)]" strokeWidth={1.5} />
      <p className="mt-2 font-medium">{title}</p>
      <p className="text-muted-foreground mt-0.5">{text}</p>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-border/60 pt-5">
      <h3 className="eyebrow">{title}</h3>
      <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{body}</p>
    </div>
  );
}
