import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { posts } from "@/lib/blog";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let productPaths: { path: string; changefreq: string; priority: string }[] = [];
        try {
          const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const url = process.env.SUPABASE_URL!;
          const sb = createClient<Database>(url, key, {
            auth: { persistSession: false },
            global: {
              fetch: (input, init) => {
                const h = new Headers(init?.headers);
                if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                h.set("apikey", key);
                return fetch(input, { ...init, headers: h });
              },
            },
          });
          const { data } = await sb.from("products").select("slug").eq("active", true);
          productPaths = (data ?? []).map((p) => ({ path: `/produto/${p.slug}`, changefreq: "monthly", priority: "0.6" }));
        } catch {
          // ignore
        }

        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/loja", changefreq: "weekly", priority: "0.9" },
          { path: "/sobre", changefreq: "monthly", priority: "0.7" },
          { path: "/galeria", changefreq: "monthly", priority: "0.6" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/contato", changefreq: "monthly", priority: "0.5" },
          ...productPaths,
          ...posts.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6" })),
        ];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
