import raizAurea from "@/assets/uploaded/colar-raiz-aurea.png.asset.json";
import sementesMarrom from "@/assets/uploaded/colar-sementes-marrom.png.asset.json";
import sementesDiferentes from "@/assets/uploaded/colar-sementes-diferentes.png.asset.json";
import sementesRochas from "@/assets/uploaded/colar-sementes-rochas.png.asset.json";
import acaiMagenta from "@/assets/uploaded/colar-acai-magenta.png.asset.json";
import conjuntoTurquesa from "@/assets/uploaded/conjunto-turquesa.png.asset.json";
import conjuntoCocoMadeira from "@/assets/uploaded/conjunto-coco-madeira.png.asset.json";

const imagesByCategory: Record<Category, string[]> = {
  colares: [raizAurea.url, sementesMarrom.url, sementesDiferentes.url, sementesRochas.url, acaiMagenta.url],
  brincos: [conjuntoTurquesa.url, conjuntoCocoMadeira.url],
  pulseiras: [conjuntoTurquesa.url, conjuntoCocoMadeira.url],
  "edicoes-limitadas": [acaiMagenta.url, sementesRochas.url, conjuntoTurquesa.url, sementesDiferentes.url],
};

export type Category = "colares" | "brincos" | "pulseiras" | "edicoes-limitadas";

export const categories: { slug: Category; name: string; tagline: string }[] = [
  { slug: "colares", name: "Colares", tagline: "Peças de presença, da clavícula ao peito." },
  { slug: "brincos", name: "Brincos", tagline: "Pequenos gestos, grande contorno." },
  { slug: "pulseiras", name: "Pulseiras", tagline: "Camadas leves para o dia a dia." },
  { slug: "edicoes-limitadas", name: "Edições Limitadas", tagline: "Numeradas, raras, autorais." },
];

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  origin: string;
  process: string;
  meaning: string;
  story: string;
};

const imageFor = (c: Category, n: number) => {
  const list = imagesByCategory[c];
  return list[n % list.length];
};

const seedNames = [
  "Açaí", "Jarina", "Tagua", "Olho-de-cabra", "Paxiúba", "Buriti", "Jupati",
  "Patauá", "Inajá", "Tucumã", "Murumuru", "Babaçu", "Pupunha", "Castanha",
];

const origins = [
  "Comunidade ribeirinha do Médio Solimões (AM)",
  "Cooperativa de mulheres do Marajó (PA)",
  "Reserva extrativista do Alto Juruá (AC)",
  "Quilombo Kalunga (GO)",
  "Aldeia Krahô do Tocantins",
  "Sertão da Chapada dos Veadeiros (GO)",
];

const processes = [
  "Sementes coletadas após a queda natural, lavadas em água de chuva, polidas à mão com cera de carnaúba e amarradas em fio de algodão encerado.",
  "Furadas uma a uma com arco de pua, finalizadas com fecho em latão reciclado e tingidas com pigmentos vegetais.",
  "Trançadas em fibras de buriti pela artesã, em técnica passada de mãe para filha há três gerações.",
  "Engastadas em prata 950 vinda de pequenos garimpos certificados; selagem com óleo de copaíba.",
];

const meanings = [
  "Símbolo de fartura e renovação na cosmologia dos povos da floresta.",
  "Representa proteção e o cuidado coletivo das matriarcas da comunidade.",
  "Carrega a memória das águas que alimentam a Amazônia.",
  "Marca de passagem e maturidade nas tradições do cerrado.",
  "Conexão com a terra: cada semente é também um possível broto.",
];

function makeProducts(): Product[] {
  const counts: Record<Category, number> = {
    colares: 14, brincos: 14, pulseiras: 14, "edicoes-limitadas": 8,
  };
  const out: Product[] = [];
  let i = 0;
  for (const cat of Object.keys(counts) as Category[]) {
    for (let n = 1; n <= counts[cat]; n++, i++) {
      const seed = seedNames[i % seedNames.length];
      const namePrefix =
        cat === "colares" ? "Colar" :
        cat === "brincos" ? "Brinco" :
        cat === "pulseiras" ? "Pulseira" : "Peça";
      const suffixes = ["Raiz", "Vento", "Sertão", "Igarapé", "Aurora", "Cerrado", "Folhagem", "Solstício", "Vereda", "Pétala", "Dunas", "Semeadura", "Travessia", "Murmúrio"];
      const name = `${namePrefix} ${seed} ${suffixes[n % suffixes.length]}`;
      const basePrice = cat === "edicoes-limitadas" ? 380 : cat === "colares" ? 180 : cat === "brincos" ? 120 : 95;
      const price = basePrice + (n * 7) % 60;
      out.push({
        slug: `${cat}-${seed.toLowerCase().replace(/[^a-z]/g, "")}-${n}`,
        name,
        category: cat,
        price,
        image: imageFor(cat),
        origin: origins[i % origins.length],
        process: processes[i % processes.length],
        meaning: meanings[i % meanings.length],
        story: `A ${name.toLowerCase()} nasceu do encontro entre a semente de ${seed.toLowerCase()} e as mãos de quem coleta, lava e amarra cada peça. Uma joia viva, que carrega a história da floresta para o seu corpo.`,
      });
    }
  }
  return out;
}

export const products: Product[] = makeProducts();

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const byCategory = (c: Category) => products.filter((p) => p.category === c);

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
