import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { posts } from "@/lib/blog";
import flatlayImg from "@/assets/collection-flatlay.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Diário — Sustentabilidade no artesanato | Divou Biojoias" },
      { name: "description", content: "Posts sobre biojoias sustentáveis, técnicas de artesanato natural e cuidados com peças vivas." },
      { property: "og:title", content: "Diário Divou" },
      { property: "og:description", content: "Sustentabilidade, técnica e história do artesanato brasileiro." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container-editorial pt-12 pb-20 flex-1">
        <span className="eyebrow">Diário</span>
        <h1 className="display-serif mt-3 text-5xl md:text-7xl max-w-3xl">
          Sustentabilidade no artesanato.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Reflexões, processos e cuidados — direto do nosso ateliê e das comunidades parceiras.
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className={`group ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className={`overflow-hidden rounded-sm bg-muted ${i === 0 ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                <img src={flatlayImg} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <span className="eyebrow mt-5 block">{post.category} · {post.readTime}</span>
              <h2 className={`display-serif mt-2 group-hover:text-[color:var(--color-clay)] transition-colors ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>
                {post.title}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
