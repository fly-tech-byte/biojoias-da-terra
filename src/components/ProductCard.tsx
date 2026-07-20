import { Link } from "@tanstack/react-router";
import { formatBRL, mainImage, type ProductWithRelations } from "@/lib/db";

export function ProductCard({ product, index = 0 }: { product: ProductWithRelations; index?: number }) {
  const img = mainImage(product);
  const isLimited = product.categories?.slug === "edicoes-limitadas";
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[color:var(--color-secondary)]">
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading={index < 4 ? "eager" : "lazy"}
            width={1024}
            height={1280}
            className="h-full w-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full grid place-items-center text-xs text-muted-foreground">sem imagem</div>
        )}
        {isLimited && (
          <span className="absolute top-3 left-3 eyebrow !text-[0.65rem] bg-background/90 px-2.5 py-1 rounded-full">
            Edição limitada
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="absolute top-3 right-3 eyebrow !text-[0.65rem] bg-foreground/90 text-background px-2.5 py-1 rounded-full">
            Esgotado
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
          {product.origin && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {product.origin.split("(")[0].trim()}
            </p>
          )}
        </div>
        <p className="text-sm font-medium whitespace-nowrap">{formatBRL(product.price)}</p>
      </div>
    </Link>
  );
}
