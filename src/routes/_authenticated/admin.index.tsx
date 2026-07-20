import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchAdminProducts, fetchCategories } from "@/lib/db";
import { Package, PackageCheck, PackageX, AlertTriangle, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: fetchAdminProducts });
  const cats = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [seeding, setSeeding] = useState(false);

  const list = products.data ?? [];
  const total = list.length;
  const active = list.filter((p) => p.active).length;
  const inactive = total - active;
  const outOfStock = list.filter((p) => p.stock_quantity === 0).length;
  const lowStock = list.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length;

  async function seedExamples() {
    if (!cats.data || cats.data.length === 0) {
      toast.error("Crie categorias primeiro.");
      return;
    }
    setSeeding(true);
    try {
      const catBySlug = Object.fromEntries(cats.data.map((c) => [c.slug, c.id]));
      const samples = [
        { slug: "colar-raiz-aurea", name: "Colar Raiz Áurea", cat: "colares", price: 210 },
        { slug: "colar-sementes-diferentes", name: "Colar Sementes Diferentes", cat: "colares", price: 245 },
        { slug: "colar-sementes-marrom", name: "Colar Sementes Marrom", cat: "colares", price: 195 },
        { slug: "colar-acai-magenta", name: "Colar Açaí Magenta", cat: "colares", price: 230 },
        { slug: "brinco-croche-verde", name: "Brinco Crochê Verde", cat: "brincos", price: 135 },
        { slug: "brinco-croche-mostarda", name: "Brinco Crochê Mostarda", cat: "brincos", price: 135 },
        { slug: "brinco-acai-marrom", name: "Brinco Açaí Marrom", cat: "brincos", price: 120 },
        { slug: "conjunto-turquesa-completo", name: "Conjunto Turquesa Completo", cat: "edicoes-limitadas", price: 480 },
      ];
      const rows = samples.map((s, i) => ({
        slug: s.slug,
        name: s.name,
        category_id: catBySlug[s.cat] ?? null,
        price: s.price,
        stock_quantity: 5 + i,
        low_stock_threshold: 3,
        origin: "Comunidade ribeirinha do Médio Solimões (AM)",
        process: "Sementes coletadas após queda natural, polidas à mão e amarradas em fio de algodão encerado.",
        meaning: "Símbolo de fartura e renovação na cosmologia dos povos da floresta.",
        story: `A ${s.name.toLowerCase()} nasce do encontro entre a floresta e mãos artesãs.`,
        featured: i < 4,
        active: true,
      }));
      const { error } = await supabase.from("products").upsert(rows, { onConflict: "slug" });
      if (error) throw error;
      toast.success(`${rows.length} produtos de exemplo cadastrados.`);
      products.refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao popular");
    } finally {
      setSeeding(false);
    }
  }

  const cards = [
    { label: "Produtos totais", value: total, icon: Package, tone: "bg-background" },
    { label: "Ativos", value: active, icon: PackageCheck, tone: "bg-[color:var(--color-moss)]/10" },
    { label: "Inativos", value: inactive, icon: PackageX, tone: "bg-background" },
    { label: "Sem estoque", value: outOfStock, icon: AlertTriangle, tone: "bg-[color:var(--color-clay)]/10" },
    { label: "Estoque baixo", value: lowStock, icon: AlertTriangle, tone: "bg-background" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Painel</span>
          <h1 className="display-serif text-4xl mt-2">Bem-vinda de volta.</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do catálogo em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/loja" className="btn-ghost">
            Ver loja <ExternalLink className="h-4 w-4" />
          </Link>
          <Link to="/admin/produtos/novo" className="btn-primary">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`border border-border/60 rounded-sm p-5 ${c.tone}`}>
            <c.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-3xl font-light mt-4">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {total === 0 && (
        <div className="mt-10 border border-dashed border-border rounded-sm p-8 text-center bg-background">
          <h2 className="display-serif text-2xl">Comece o catálogo</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Cadastre o primeiro produto manualmente ou importe uma seleção de exemplos para começar.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Link to="/admin/produtos/novo" className="btn-primary">
              <Plus className="h-4 w-4" /> Cadastrar produto
            </Link>
            <button onClick={seedExamples} disabled={seeding} className="btn-ghost">
              {seeding ? "Importando…" : "Popular com exemplos"}
            </button>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium mb-4">Últimos cadastros</h2>
          <div className="border border-border/60 rounded-sm bg-background divide-y divide-border/60">
            {list.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                to="/admin/produtos/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted"
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.categories?.name ?? "Sem categoria"} · Estoque {p.stock_quantity}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-[color:var(--color-moss)]/10 text-[color:var(--color-moss)]" : "bg-muted text-muted-foreground"}`}>
                  {p.active ? "Ativo" : "Inativo"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
