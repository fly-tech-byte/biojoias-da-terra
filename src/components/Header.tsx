import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/loja", label: "Loja" },
  { to: "/sobre", label: "Sobre" },
  { to: "/galeria", label: "Galeria" },
  { to: "/blog", label: "Diário" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--color-background)]/85 border-b border-border/60">
      <div className="container-editorial flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="display-serif text-2xl md:text-[28px]">divou</span>
          <span className="eyebrow hidden md:inline mt-1">biojoias</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm transition-colors ${
                pathname === n.to ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button aria-label="Buscar" className="p-2 hover:opacity-70">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <Link to="/loja" aria-label="Sacola" className="p-2 hover:opacity-70 relative">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <nav className="container-editorial py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm border-b border-border/40 last:border-0"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
