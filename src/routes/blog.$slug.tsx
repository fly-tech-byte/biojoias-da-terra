import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPost } from "@/lib/blog";
import { ArrowLeft } from "lucide-react";
import flatlayImg from "@/assets/collection-flatlay.jpg";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Divou Biojoias` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/blog/${loaderData.post.slug}` }] : [],
    scripts: loaderData
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.post.title,
            datePublished: loaderData.post.date,
            author: { "@type": "Organization", name: "Divou Biojoias" },
          }),
        }]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col"><Header /><div className="container-editorial py-32 text-center"><p>Post não encontrado.</p><Link to="/blog" className="link-underline mt-4 inline-flex">Ver todos os posts</Link></div><Footer /></div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex flex-col"><Header /><div className="container-editorial py-32 text-center"><p>{error.message}</p></div><Footer /></div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="container-editorial pt-10 pb-20 max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> voltar ao diário
          </Link>
          <span className="eyebrow mt-8 block">{post.category} · {post.date} · {post.readTime}</span>
          <h1 className="display-serif text-4xl md:text-6xl mt-4">{post.title}</h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-sm">
            <img src={flatlayImg} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="mt-10 space-y-6 text-lg leading-relaxed">
            {post.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
