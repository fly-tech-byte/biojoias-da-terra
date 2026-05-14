import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, products, formatBRL } from "@/lib/products";
import { ArrowLeft, Truck, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Divou Biojoias` },
          { name: "description", content: loaderData.product.story },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.meaning },
          { property: "og:image", content: loaderData.product.image },
          { property: "og:type", content: "product" },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/produto/${loaderData.product.slug}` }] : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col"><Header /><div className="container-editorial py-32 text-center"><p>Peça não encontrada.</p><Link to="/loja" className="link-underline mt-4 inline-flex">Voltar à loja</Link></div><Footer /></div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex flex-col"><Header /><div className="container-editorial py-32 text-center"><p>{error.message}</p></div><Footer /></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const installments = (product.price / 12).toFixed(2).replace(".", ",");
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <Link to="/loja" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> voltar à loja
          </Link>
        </div>

        <section className="container-editorial mt-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[4/5] overflow-hidden rounded-sm bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" width={1024} height={1280} />
            </div>
            <div className="aspect-square overflow-hidden rounded-sm bg-muted">
              <img src={product.image} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-sm bg-muted">
              <img src={product.image} alt="" loading="lazy" className="h-full w-full object-cover scale-110" />
            </div>
          </div>

          <div className="md:col-span-5 md:sticky md:top-24 md:self-start">
            <span className="eyebrow">{product.category.replace("-", " ")}</span>
            <h1 className="display-serif text-4xl md:text-5xl mt-3">{product.name}</h1>
            <p className="mt-6 text-3xl font-light">{formatBRL(product.price)}</p>
            <p className="text-sm text-muted-foreground">
              ou 12x de R$ {installments} sem juros · 5% off no Pix
            </p>

            <div className="mt-8 space-y-3">
              <button className="btn-primary w-full !py-4 text-base">Adicionar à sacola</button>
              <button className="btn-ghost w-full !py-4 text-base">Comprar pelo WhatsApp</button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
              <Detail icon={Truck} title="Envio" text="PAC e Sedex para todo Brasil" />
              <Detail icon={Sparkles} title="Embalagem" text="Caixa reciclada + cartão da peça" />
              <Detail icon={ShieldCheck} title="Garantia" text="Reparos vitalícios" />
            </div>

            <div className="mt-10 space-y-6 text-sm leading-relaxed">
              <Block title="Origem da semente" body={product.origin} />
              <Block title="Processo artesanal" body={product.process} />
              <Block title="Significado cultural" body={product.meaning} />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="container-editorial mt-24">
            <h2 className="display-serif text-3xl mb-8">Você também pode gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Detail({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="border border-border/70 rounded-sm p-3">
      <Icon className="h-4 w-4 text-[color:var(--color-clay)]" strokeWidth={1.5} />
      <p className="mt-2 font-medium">{title}</p>
      <p className="text-muted-foreground mt-0.5">{text}</p>
    </div>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-border/60 pt-5">
      <h3 className="eyebrow">{title}</h3>
      <p className="mt-2 text-foreground/90">{body}</p>
    </div>
  );
}
