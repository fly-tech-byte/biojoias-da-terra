import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/setup-panel-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const email = "adm@divoubiojoias.com";
        const password = "divou12345";

        const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        let userId = created?.user?.id ?? null;
        if (error && !userId) {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers();
          userId = list?.users.find((u) => u.email === email)?.id ?? null;
          if (userId) {
            await supabaseAdmin.auth.admin.updateUserById(userId, { password, email_confirm: true });
          }
        }
        if (!userId) return new Response(JSON.stringify({ ok: false, error: error?.message }), { status: 500 });

        await supabaseAdmin.from("user_roles").upsert(
          { user_id: userId, role: "admin" },
          { onConflict: "user_id,role" },
        );

        return new Response(JSON.stringify({ ok: true, userId }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
