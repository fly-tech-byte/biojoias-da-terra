import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import processImg from "@/assets/process-hands.jpg";
import flatlayImg from "@/assets/collection-flatlay.jpg";
import heroImg from "@/assets/hero-model.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Nossa história — Divou Biojoias" },
      { name: "description", content: "A Divou nasceu entre comunidades ribeirinhas e mãos artesãs. Conheça nossa fundadora e os parceiros que tornam cada peça possível." },
      { property: "og:title", content: "Nossa história — Divou Biojoias" },
      { property: "og:description", content: "Biojoias com origem rastreável, feitas por sete cooperativas brasileiras." },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-editorial pt-16 pb-20 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-8 md:col-start-3">
            <span className="eyebrow">Nossa história</span>
            <h1 className="display-serif mt-4 text-5xl md:text-7xl">
              Quem é a divou biojoias?
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Diva Mesquita de Oliveira Coelho, natural de Minas Gerais na pequena cidade de Pedra do Indaiá. Cursou Escola Normal em Santo Antônio do Monte. Migrou para Brasília em 1984, prestou concurso SEEDF para professora de séries iniciais tomou posse no ano de 1996, cursou faculdade e pós-graduação oferecidos por projetos de políticas públicas. Após aposentar, buscou no artesanato uma forma prazerosa de usar suas habilidades na arte. Artesã de biojoias. As criações de biojoias surgiram a partir do curso ofertado pela Secretaria da Mulher, ministrado pelo Mestre Juão de Fibra. Realizou curso de aperfeiçoamento e curadoria pelo SEBRAE. Propõe em suas criações uso do crochê e sementes. Cada criação é arraigada de amor e dedicação. A inspiração vem das cores e elementos do serrado e de sementes que compõem bioma brasileiro norte/nordeste e centro oeste. O artesanato majoritariamente confeccionado com matéria prima natural. A energia da natureza, traz proteção, beleza e sofisticação nos acessórios para compor um visual elegante.
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Natural de Minas Gerais e ex-professora da rede pública de Brasília, Diva Mesquita de Oliveira Coelho encontrou no artesanato sua nova vocação. Especializou-se em biojoias através de formações com a Secretaria da Mulher (Mestre Juão de Fibra) e SEBRAE. Suas criações autorais fundem crochê e sementes nativas do Cerrado, Norte e Nordeste, resultando em acessórios sustentáveis que unem elegância, afeto e a força da natureza.
            </p>
          </div>
        </section>

        <section className="bg-[color:var(--color-secondary)]/50 py-20">
          <div className="container-editorial grid md:grid-cols-3 gap-8">
            {[
              { n: "+80", t: "famílias com renda direta" },
              { n: "7", t: "cooperativas parceiras" },
              { n: "100%", t: "sementes de coleta natural" },
            ].map((s) => (
              <div key={s.t} className="border-t border-foreground/30 pt-6">
                <p className="display-serif text-6xl">{s.n}</p>
                <p className="mt-2 text-muted-foreground">{s.t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-editorial py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <div className="aspect-[5/4] overflow-hidden rounded-sm">
              <img src={processImg} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-6">
            <span className="eyebrow">Como nasce uma Divou</span>
            <h2 className="display-serif mt-4 text-4xl md:text-5xl">Quatro estações,<br/>quatro mãos.</h2>
            <ol className="mt-8 space-y-6">
              {[
                ["Coleta", "Sementes recolhidas do chão da floresta, depois da queda natural."],
                ["Beneficiamento", "Lavadas, secas ao sol e polidas com cera vegetal."],
                ["Composição", "Trançadas, furadas e amarradas pelas artesãs parceiras."],
                ["Acabamento", "Conferência, embalagem reciclada e cartão com a história."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5 border-t border-border/60 pt-5">
                  <span className="display-serif text-2xl text-[color:var(--color-clay)]">0{i + 1}</span>
                  <div>
                    <p className="font-medium">{t}</p>
                    <p className="text-sm text-muted-foreground mt-1">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[color:var(--color-moss)] text-[color:var(--color-sand)] py-24">
          <div className="container-editorial text-center max-w-2xl">
            <span className="eyebrow !text-[color:var(--color-sand-deep)]">Convite</span>
            <h2 className="display-serif text-4xl md:text-6xl mt-4">
              Use uma joia que conta uma história.
            </h2>
            <Link to="/loja" className="btn-primary mt-8 !bg-[color:var(--color-sand)] !text-[color:var(--color-moss)]">
              Conhecer a coleção
            </Link>
          </div>
        </section>

        <section className="container-editorial py-20">
          <div className="aspect-[16/7] overflow-hidden rounded-sm">
            <img src={flatlayImg} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
