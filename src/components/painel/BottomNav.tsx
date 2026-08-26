import { Package, ClipboardList, User } from "lucide-react";

export type PanelTab = "produtos" | "pedidos" | "perfil";

const tabs: { id: PanelTab; label: string; icon: typeof Package }[] = [
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList },
  { id: "perfil", label: "Perfil", icon: User },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: PanelTab;
  onChange: (tab: PanelTab) => void;
}) {
  return (
    <nav
      aria-label="Navegação do painel"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-2xl text-[0.7rem] transition-colors ${
                  isActive
                    ? "text-[color:var(--color-clay)] font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                    isActive ? "bg-[color:var(--color-clay)]/12" : ""
                  }`}
                >
                  <t.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                {t.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
