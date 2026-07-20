import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Tags, LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel — Divou Biojoias" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package, exact: false },
  { to: "/admin/categorias", label: "Categorias", icon: Tags, exact: false },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading, refreshRole } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function claimAdmin() {
    if (!user) return;
    setClaiming(true);
    try {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      if (data) {
        toast.success("Você agora é administrador.");
        await refreshRole(user.id);
      } else {
        toast.error("Já existe um administrador cadastrado.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao promover");
    } finally {
      setClaiming(false);
    }
  }

  if (loading) return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="min-h-screen flex bg-[color:var(--color-secondary)]/30">
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-background sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/" className="display-serif text-2xl">divou</Link>
          <p className="eyebrow mt-1">painel administrativo</p>
        </div>
        <nav className="px-3 flex-1">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm mb-1 ${
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <l.icon className="h-4 w-4" strokeWidth={1.5} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/60 space-y-3">
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" strokeWidth={1.5} /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background">
          <Link to="/" className="display-serif text-xl">divou</Link>
          <button onClick={signOut} className="text-xs text-muted-foreground">Sair</button>
        </header>

        {!isAdmin && (
          <div className="p-6">
            <div className="max-w-xl mx-auto mt-8 border border-border/60 rounded-sm bg-background p-8 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[color:var(--color-clay)]" strokeWidth={1.5} />
              <h2 className="display-serif text-2xl mt-4">Ativar acesso administrativo</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sua conta ainda não é administradora. Se este é o primeiro acesso, clique abaixo
                para se tornar a administradora da loja.
              </p>
              <button onClick={claimAdmin} disabled={claiming} className="btn-primary mt-6 !py-3">
                {claiming ? "Ativando…" : "Tornar-me administradora"}
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <main className="p-6 md:p-10 max-w-7xl">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
}
