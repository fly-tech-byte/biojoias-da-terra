import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[color:var(--color-muted)]/40">
      <div className="container-editorial py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-baseline gap-2">
            <span className="display-serif text-3xl">divou</span>
            <span className="eyebrow">biojoias</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Joias vivas, feitas à mão com sementes e fibras de comunidades brasileiras.
            Cada peça carrega um pedaço de floresta — e a história de quem a colheu.
          </p>
          <form
            className="mt-8 flex max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Em breve: integração com Mailchimp.");
            }}
          >
            <input
              type="email"
              required
              placeholder="seu e-mail"
              className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button className="btn-primary !py-2.5 !px-5">Assinar</button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Receba novas coleções, edições limitadas e o nosso diário.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-sm font-medium mb-4">Navegar</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/loja">Loja</Link></li>
            <li><Link to="/sobre">Nossa história</Link></li>
            <li><Link to="/galeria">Galeria</Link></li>
            <li><Link to="/blog">Diário</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-sm font-medium mb-4">Atendimento</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/contato">Fale conosco</Link></li>
            <li>Trocas e devoluções</li>
            <li>Entregas</li>
            <li>Cuidados</li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-sm font-medium mb-4">Acompanhe</h4>
          <div className="flex items-center gap-3">
            <a aria-label="Instagram" href="#" className="p-2 rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a aria-label="WhatsApp" href="#" className="p-2 rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a aria-label="E-mail" href="mailto:dv.biojoias@gmail.com" className="p-2 rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
          <div className="mt-6 text-xs text-muted-foreground space-y-1">
            <p>Envio nacional · Retirada em Brasília</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-editorial py-6 flex flex-col md:flex-row gap-2 justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Divou Biojoias. Feito com sementes e cuidado.</p>
          <p>CNPJ 67.719.094/0001-24 · Brasília, DF</p>
        </div>
      </div>
    </footer>
  );
}
