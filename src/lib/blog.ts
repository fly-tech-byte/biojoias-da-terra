export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "biojoias-sustentaveis-o-que-sao",
    title: "Biojoias sustentáveis: o que são e por que elas importam",
    excerpt:
      "Sementes, fibras e fios naturais: entenda o que define uma biojoia e por que ela é uma escolha de impacto.",
    date: "12 de março de 2025",
    readTime: "6 min de leitura",
    category: "Sustentabilidade",
    body: [
      "Biojoias são peças confeccionadas a partir de matérias-primas vegetais — sementes, fibras, cascas e madeiras de manejo — combinadas a metais nobres ou reciclados. Mais do que um adorno, são um manifesto: cada semente é um pedaço vivo do bioma de onde veio.",
      "Quando você escolhe uma biojoia, está apoiando comunidades que vivem da floresta em pé. A semente coletada do chão tem mais valor do que a árvore derrubada — e essa equação simples é o que sustenta gerações de extrativistas no Brasil.",
      "Na Divou, trabalhamos com sementes que caem naturalmente, sem cortes ou colheita predatória. Cada peça é rastreável: você sabe de qual rio, de qual aldeia, de quais mãos ela veio.",
    ],
  },
  {
    slug: "artesanato-natural-tecnicas-ancestrais",
    title: "Artesanato natural: as técnicas ancestrais que vestimos hoje",
    excerpt:
      "Trançado de buriti, polimento com carnaúba, tingimento vegetal — técnicas que atravessam séculos.",
    date: "28 de fevereiro de 2025",
    readTime: "8 min de leitura",
    category: "Processo",
    body: [
      "Antes de virar joia, cada semente passa por um percurso de mãos. Na cooperativa do Marajó, mulheres tingem fibras com urucum e jenipapo, num saber passado de avó para neta.",
      "O polimento com cera de carnaúba dá brilho sem agredir a casca. O fecho em latão reciclado evita extração mineral nova. Tudo é decisão consciente.",
    ],
  },
  {
    slug: "cuidados-com-suas-biojoias",
    title: "Como cuidar das suas biojoias para que durem décadas",
    excerpt: "Pequenos rituais que prolongam a vida das peças naturais que você ama usar.",
    date: "10 de fevereiro de 2025",
    readTime: "4 min de leitura",
    category: "Cuidado",
    body: [
      "Evite contato direto com perfumes e cremes hidratantes — aplique-os primeiro, deixe secar e só então coloque a peça.",
      "Guarde em saquinho de algodão, longe da umidade. Uma vez por ano, passe um pouco de óleo de coco com pano macio para reavivar o brilho das sementes.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
