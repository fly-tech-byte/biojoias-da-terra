import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import heroImg from "@/assets/hero-model.jpg";
import processImg from "@/assets/process-hands.jpg";
import flatlayImg from "@/assets/collection-flatlay.jpg";
import necklaceImg from "@/assets/product-necklace.jpg";
import earringImg from "@/assets/product-earring.jpg";
import braceletImg from "@/assets/product-bracelet.jpg";
import limitedImg from "@/assets/product-limited.jpg";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Divou Biojoias" },
      { name: "description", content: "Fotos de produtos, lifestyle e processo artesanal das biojoias Divou." },
      { property: "og:title", content: "Galeria — Divou Biojoias" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: Galeria,
});

const items = [
  { src: heroImg, span: "md:col-span-6 md:row-span-2 aspect-[4/5]", caption: "Coleção Outono" },
  { src: necklaceImg, span: "md:col-span-3 aspect-square", caption: "Colar Tagua" },
  { src: earringImg, span: "md:col-span-3 aspect-square", caption: "Brinco Açaí" },
  { src: processImg, span: "md:col-span-3 aspect-[4/5]", caption: "Processo" },
  { src: flatlayImg, span: "md:col-span-3 aspect-[4/5]", caption: "Flatlay" },
  { src: braceletImg, span: "md:col-span-4 aspect-square", caption: "Pulseiras" },
  { src: limitedImg, span: "md:col-span-4 aspect-square", caption: "Edição limitada" },
  { src: necklaceImg, span: "md:col-span-4 aspect-square", caption: "Detalhe" },
];

function Galeria() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container-editorial pt-12 pb-20 flex-1">
        <span className="eyebrow">Galeria</span>
        <h1 className="display-serif mt-3 text-5xl md:text-7xl">Olhar de perto.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Fotos de produto, processo e lifestyle. Sinta a textura.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-12 gap-3">
          {items.map((it, i) => (
            <figure key={i} className={`relative overflow-hidden rounded-sm group ${it.span}`}>
              <img src={it.src} alt={it.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <figcaption className="absolute bottom-3 left-3 eyebrow !text-[color:var(--color-sand)] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {it.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
