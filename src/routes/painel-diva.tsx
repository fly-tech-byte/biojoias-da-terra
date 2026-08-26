import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, AlertTriangle, ArrowRight, LogOut, Store, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchAdminProducts, fetchCategories, formatBRL, mainImage, type ProductWithRelations } from "@/lib/db";
import {
  fetchOrders,
  nextOrderStatus,
  orderStatusLabel,
  updateOrderStatus,
  type OrderRow,
} from "@/lib/orders";
import { BottomNav, type PanelTab } from "@/components/painel/BottomNav";
import { PanelLogin } from "@/components/painel/PanelLogin";
import { PanelProductSheet } from "@/components/painel/PanelProductSheet";
import { PanelOrderSheet } from "@/components/painel/PanelOrderSheet";
import { toast } from "sonner";

export const Route = createFileRoute("/painel-diva")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel da Diva — Divou Biojoias" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PanelPage,
});

function PanelPage() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }
  if (!user) return <PanelLogin />;
  if (!isAdmin) return <NoAccess />;
  return <Panel email={user.email ?? ""} />;
}

function NoAccess() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div className="max-w-sm space-y-4">
        <h1 className="display-serif text-3xl">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground">
          Esta conta não tem permissão para usar o painel.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="btn-ghost min-h-12 w-full justify-center rounded-2xl"
        >
          Sair
        </button>
      </div>
    </main>
  );
}

function Panel({ email }: { email: string }) {
  const [tab, setTab] = useState<PanelTab>("produtos");
  const [productSheet, setProductSheet] = useState<{ open: boolean; product: ProductWithRelations | null }>({
    open: false,
    product: null,
  });
  const [orderSheet, setOrderSheet] = useState(false);

  const products = useQuery({ queryKey: ["panel", "products"], queryFn: fetchAdminProducts });
  const categories = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const orders = useQuery({ queryKey: ["panel", "orders"], queryFn: fetchOrders });

  const list = products.data ?? [];
  const openOrders = (orders.data ?? []).filter((o) => o.status !== "entregue");

  async function advance(order: OrderRow) {
    const next = nextOrderStatus(order.status);
    if (next === order.status) return;
    try {
      await updateOrderStatus(order.id, next);
      toast.success(`Pedido: ${orderStatusLabel[next]}`);
      orders.refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível atualizar.");
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-secondary)]/30 pb-28">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 px-5 py-4 backdrop-blur">
        <p className="eyebrow">Divou Biojoias</p>
        <h1 className="display-serif text-2xl">
          {tab === "produtos" ? "Minhas peças" : tab === "pedidos" ? "Pedidos" : "Meu perfil"}
        </h1>
      </header>

      <main className="mx-auto max-w-md px-5 py-6">
        {tab === "produtos" && (
          <section className="space-y-3">
            {products.isLoading && <p className="text-sm text-muted-foreground">Carregando peças…</p>}
            {!products.isLoading && list.length === 0 && (
              <EmptyState
                title="Nenhuma peça ainda"
                description="Toque no + para cadastrar sua primeira biojoia."
              />
            )}
            {list.map((p) => {
              const img = mainImage(p);
              const low = p.stock_quantity <= p.low_stock_threshold;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProductSheet({ open: true, product: p })}
                  className="flex w-full items-center gap-4 rounded-3xl border border-border/60 bg-background p-3 text-left"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    {img ? (
                      <img src={img} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-muted-foreground">
                        <Package className="h-6 w-6" strokeWidth={1.6} />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{formatBRL(p.price)}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[0.7rem]">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                        {p.categories?.name ?? "Sem categoria"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          low
                            ? "bg-[color:var(--color-terracotta)]/15 text-[color:var(--color-terracotta)]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.stock_quantity === 0 ? "Sem estoque" : `Estoque ${p.stock_quantity}`}
                      </span>
                      {!p.active && (
                        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-muted-foreground">
                          Inativa
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                </button>
              );
            })}
          </section>
        )}

        {tab === "pedidos" && (
          <section className="space-y-3">
            {orders.isLoading && <p className="text-sm text-muted-foreground">Carregando pedidos…</p>}
            {!orders.isLoading && (orders.data ?? []).length === 0 && (
              <EmptyState
                title="Nenhum pedido registrado"
                description="Toque no + para anotar um pedido recebido pelo WhatsApp."
              />
            )}
            {(orders.data ?? []).map((o) => (
              <article key={o.id} className="rounded-3xl border border-border/60 bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="truncate text-sm text-muted-foreground">{o.product_name}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[color:var(--color-clay)]/12 px-3 py-1 text-xs text-[color:var(--color-clay)]">
                    {orderStatusLabel[o.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {o.quantity} un · {formatBRL(o.total_amount)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Atualizado em {new Date(o.updated_at).toLocaleDateString("pt-BR")}
                </p>
                {o.status !== "entregue" && (
                  <button
                    type="button"
                    onClick={() => advance(o)}
                    className="btn-primary mt-4 min-h-12 w-full justify-center rounded-2xl text-sm"
                  >
                    Marcar como {orderStatusLabel[nextOrderStatus(o.status)]}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                )}
              </article>
            ))}
          </section>
        )}

        {tab === "perfil" && (
          <section className="space-y-4">
            <div className="rounded-3xl border border-border/60 bg-background p-5">
              <p className="eyebrow">Conta</p>
              <p className="mt-1 font-medium">Diva Mesquita</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Peças" value={list.length} />
              <Stat label="Sem estoque" value={list.filter((p) => p.stock_quantity === 0).length} />
              <Stat label="Em aberto" value={openOrders.length} />
            </div>
            {list.some((p) => p.stock_quantity <= p.low_stock_threshold) && (
              <p className="flex items-start gap-2 rounded-3xl bg-[color:var(--color-terracotta)]/10 p-4 text-sm text-[color:var(--color-terracotta)]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
                Algumas peças estão com estoque baixo.
              </p>
            )}
            <Link
              to="/loja"
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-border bg-background text-sm"
            >
              <Store className="h-4 w-4" strokeWidth={1.6} /> Ver a loja
            </Link>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border text-sm text-muted-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.6} /> Sair do painel
            </button>
          </section>
        )}
      </main>

      {tab !== "perfil" && (
        <button
          type="button"
          aria-label={tab === "produtos" ? "Nova peça" : "Novo pedido"}
          onClick={() =>
            tab === "produtos" ? setProductSheet({ open: true, product: null }) : setOrderSheet(true)
          }
          className="fixed bottom-24 right-5 z-40 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-clay)] text-[color:var(--color-sand)] shadow-lg"
        >
          <Plus className="h-7 w-7" strokeWidth={1.8} />
        </button>
      )}

      <PanelProductSheet
        open={productSheet.open}
        product={productSheet.product}
        categories={categories.data ?? []}
        onClose={() => setProductSheet({ open: false, product: null })}
        onSaved={() => products.refetch()}
      />
      <PanelOrderSheet
        open={orderSheet}
        products={list}
        onClose={() => setOrderSheet(false)}
        onSaved={() => orders.refetch()}
      />

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-background p-4 text-center">
      <p className="display-serif text-2xl">{value}</p>
      <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border p-8 text-center">
      <p className="display-serif text-xl">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
