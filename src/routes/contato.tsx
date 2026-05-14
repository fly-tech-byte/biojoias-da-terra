import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, MessageCircle, Mail, Instagram } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Divou Biojoias" },
      { name: "description", content: "Fale com a Divou: WhatsApp, e-mail, retirada em Brasília e atendimento personalizado." },
      { property: "og:title", content: "Contato — Divou Biojoias" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: Contato,
});

function Contato() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container-editorial pt-12 pb-20 flex-1">
        <span className="eyebrow">Contato</span>
        <h1 className="display-serif mt-3 text-5xl md:text-7xl">Vamos conversar.</h1>

        <div className="mt-14 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8">
            <Item icon={MessageCircle} title="WhatsApp" text="(61) 99999-0000" sub="Atendimento das 9h às 18h, seg-sex" />
            <Item icon={Mail} title="E-mail" text="ola@divoubiojoias.com.br" sub="Respondemos em até 24h úteis" />
            <Item icon={MapPin} title="Retirada" text="SCS, Brasília · DF" sub="Pontos parceiros — agendamos com você" />
            <Item icon={Instagram} title="Instagram" text="@divoubiojoias" sub="Bastidores e novidades" />
          </div>

          <form
            className="md:col-span-7 space-y-4 bg-[color:var(--color-card)] border border-border/60 rounded-sm p-6 md:p-10"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <h2 className="display-serif text-3xl">Envie uma mensagem</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nome" type="text" />
              <Field label="E-mail" type="email" />
            </div>
            <Field label="Assunto" type="text" />
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Mensagem</label>
              <textarea required rows={5} className="mt-1 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <button className="btn-primary">{sent ? "Recebido — obrigada!" : "Enviar mensagem"}</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Item({ icon: Icon, title, text, sub }: { icon: any; title: string; text: string; sub: string }) {
  return (
    <div className="flex gap-4">
      <div className="p-3 rounded-full border border-border/70 h-fit">
        <Icon className="h-4 w-4 text-[color:var(--color-clay)]" strokeWidth={1.5} />
      </div>
      <div>
        <p className="eyebrow">{title}</p>
        <p className="text-lg mt-1">{text}</p>
        <p className="text-sm text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input required type={type} className="mt-1 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}
