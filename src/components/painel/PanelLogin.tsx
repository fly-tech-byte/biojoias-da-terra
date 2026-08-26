import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoDivou from "@/assets/logo-divou.svg";

export function PanelLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      toast.success("Bem-vinda, Diva.");
    } catch (err: any) {
      toast.error(err?.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : err?.message ?? "Falha ao entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[color:var(--color-secondary)]/40 px-6 py-16">
      <div className="mx-auto w-full max-w-sm">
        <img src={logoDivou} alt="Divou Biojoias" className="mx-auto h-16" />
        <h1 className="display-serif mt-8 text-center text-3xl">Painel da Diva</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Entre para cuidar das suas peças e pedidos.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">E-mail</span>
            <input
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1.5 min-h-13"
              placeholder="adm@divoubiojoias.com"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Senha</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-1.5 min-h-13"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="btn-primary min-h-14 w-full justify-center rounded-2xl text-base"
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
