import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Leaf, Package, Sprout } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import { posts } from "@/lib/blog";
import heroImg from "@/assets/hero-model.jpg";
import processImg from "@/assets/process-hands.jpg";
import flatlayImg from "@/assets/collection-flatlay.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const featured = products.slice(0, 4);
  const limited = products.filter((p) => p.category === "edicoes-limitadas").slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO — magazine cover */}
        <section className="relative">
          <div className="container-editorial pt-8 md:pt-12">
            <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end">
              <div className="md:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="eyebrow">Coleção Outono · 2025</span>
                  <span className="h-px w-12 bg-foreground/40" />
                  <span className="eyebrow !text-muted-foreground">Edição n° 14</span>
                </div>
                <h1 className="display-serif mt-6 text-[clamp(3rem,9vw,7.5rem)]">
                  Sementes que<br />
                  viram <em className="not-italic text-[color:var(--color-clay)]">joia</em>.
                </h1>
                <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
                  Cada peça da Divou nasce do encontro entre a floresta e mãos artesãs.
                  Biojoias sustentáveis, rastreáveis, vivas.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/loja" className="btn-primary">
                    Ver coleção <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link to="/sobre" className="btn-ghost">Nossa história</Link>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <img
                    src={heroImg}
                    alt="Modelo usando colar artesanal Divou Biojoias"
                    width={1080}
                    height={1350}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground italic">
                  Colar Açaí Vento · Coleção Outono
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE / values strip */}
        <section className="mt-20 md:mt-28 py-10 border-y border-border/60 bg-[color:var(--color-secondary)]/40">
          <div className="container-editorial grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {[
              { icon: Sprout, t: "Sementes nativas", d: "Coletadas após queda natural." },
              { icon: Leaf, t: "Comunidades parceiras", d: "Pagamento justo e rastreável." },
              { icon: Package, t: "Embalagem reciclada", d: "Caixa + cartão com a história da peça." },
              { icon: ArrowUpRight, t: "Brasília · Brasil", d: "Retirada em pontos parceiros." },
            ].map((v) => (
              <div key={v.t} className="flex items-start gap-3">
                <v.icon className="h-5 w-5 mt-0.5 text-[color:var(--color-clay)]" strokeWidth={1.5} />
                <div>
                  <p className="font-medium">{v.t}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES — magazine grid */}
        <section className="container-editorial mt-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="eyebrow">Por categoria</span>
              <h2 className="display-serif mt-2 text-4xl md:text-5xl">Encontre o seu gesto.</h2>
            </div>
            <Link to="/loja" className="link-underline hidden md:inline-flex">
              Toda a loja <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-12 gap-4">
            {categories.map((c, i) => (
              <Link
                key={c.slug}
                to="/loja"
                search={{ cat: c.slug }}
                className={`group relative overflow-hidden rounded-sm bg-[color:var(--color-muted)] ${
                  i === 0 ? "md:col-span-6 aspect-[4/5] md:aspect-[5/6]" :
                  i === 1 ? "md:col-span-6 aspect-[4/5] md:aspect-[5/6]" :
                  "md:col-span-6 aspect-[5/4]"
                }`}
              >
                <img
                  src={i % 2 === 0 ? flatlayImg : processImg}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-[color:var(--color-sand)]">
                  <span className="eyebrow !text-[color:var(--color-sand)]/80">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display-serif text-3xl md:text-4xl mt-1">{c.name}</h3>
                  <p className="text-sm opacity-90 mt-1 max-w-xs">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="container-editorial mt-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="eyebrow">Em destaque</span>
              <h2 className="display-serif mt-2 text-4xl md:text-5xl">Selecionadas a dedo.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {featured.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>

        {/* STORYTELLING — founder */}
        <section className="container-editorial mt-28 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <img src={processImg} alt="Mãos artesãs trançando fibras" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7 md:pl-10 order-1 md:order-2">
            <span className="eyebrow">A fundadora</span>
            <h2 className="display-serif mt-3 text-4xl md:text-6xl">
              "Cada semente que cai é<br />uma chance de recomeço."
            </h2>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-xl">
              A Divou nasceu em 2018, depois que Marina passou três meses entre comunidades
              ribeirinhas no Solimões. Voltou para Brasília com sementes, histórias e
              uma certeza: a floresta vale mais em pé. Hoje, a marca trabalha com sete
              cooperativas em quatro estados, garantindo renda direta a mais de 80 famílias.
            </p>
            <Link to="/sobre" className="link-underline mt-8 inline-flex">
              Ler nossa história completa <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* LIMITED EDITIONS */}
        <section className="mt-28 py-20 bg-[color:var(--color-moss)] text-[color:var(--color-sand)]">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="eyebrow !text-[color:var(--color-sand-deep)]">Edições limitadas</span>
                <h2 className="display-serif mt-2 text-4xl md:text-5xl">Numeradas. Únicas.</h2>
              </div>
              <Link to="/loja" search={{ cat: "edicoes-limitadas" }} className="hidden md:inline-flex link-underline">
                Ver todas <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {limited.map((p) => (
                <Link key={p.slug} to="/produto/$slug" params={{ slug: p.slug }} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-sm">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-4 text-lg">{p.name}</h3>
                  <p className="text-sm opacity-70 mt-1">{p.origin.split("(")[0].trim()}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* JOURNAL */}
        <section className="container-editorial mt-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="eyebrow">Diário Divou</span>
              <h2 className="display-serif mt-2 text-4xl md:text-5xl">Sustentabilidade no artesanato.</h2>
            </div>
            <Link to="/blog" className="link-underline hidden md:inline-flex">
              Todos os posts <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                  <img src={flatlayImg} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <span className="eyebrow mt-4 block">{post.category} · {post.readTime}</span>
                <h3 className="display-serif text-2xl mt-2 group-hover:text-[color:var(--color-clay)] transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
