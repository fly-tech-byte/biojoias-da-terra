import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAdminProducts, fetchCategories, formatBRL, mainImage } from "@/lib/db";
import { Plus, Search, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/produtos/")({
  component: ProductsList,
});

function ProductsList() {
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: fetchAdminProducts });
  const cats = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive" | "outofstock">("all");

  useEffect(() => {
    const channel = supabase
      .channel("admin-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        products.refetch();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, () => {
        products.refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = products.data ?? [];
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term) || p.slug.includes(term));
    }
    if (cat !== "all") list = list.filter((p) => p.category_id === cat);
    if (status === "active") list = list.filter((p) => p.active);
    if (status === "inactive") list = list.filter((p) => !p.active);
    if (status === "outofstock") list = list.filter((p) => p.stock_quantity === 0);
    return list;
  }, [products.data, q, cat, status]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h1 className="display-serif text-4xl mt-2">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} de {products.data?.length ?? 0}</p>
        </div>
        <Link to="/admin/produtos/novo" className="btn-primary">
          <Plus className="h-4 w-4" /> Novo produto
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou slug…"
            className="w-full border border-input bg-background pl-9 pr-3 py-2 rounded-sm text-sm"
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-input bg-background px-3 py-2 rounded-sm text-sm">
          <option value="all">Todas categorias</option>
          {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="border border-input bg-background px-3 py-2 rounded-sm text-sm">
          <option value="all">Todos status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="outofstock">Sem estoque</option>
        </select>
      </div>

      <div className="mt-6 border border-border/60 rounded-sm bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-3 px-4">Produto</th>
              <th className="py-3 px-4 hidden md:table-cell">Categoria</th>
              <th className="py-3 px-4">Preço</th>
              <th className="py-3 px-4">Estoque</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((p) => {
              const img = mainImage(p);
              const low = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
              const out = p.stock_quantity === 0;
              return (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-muted rounded-sm overflow-hidden shrink-0">
                        {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{p.categories?.name ?? "—"}</td>
                  <td className="py-3 px-4">{formatBRL(p.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 ${out ? "text-red-600" : low ? "text-amber-700" : ""}`}>
                      {(out || low) && <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-[color:var(--color-moss)]/10 text-[color:var(--color-moss)]" : "bg-muted text-muted-foreground"}`}>
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                    {p.featured && <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[color:var(--color-clay)]/10 text-[color:var(--color-clay)]">Destaque</span>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to="/admin/produtos/$id" params={{ id: p.id }} className="link-underline text-xs">Editar</Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}