import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/components/ui/product-image";
import type { ShowcaseProduct } from "@/lib/products/featured";

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export function ProductGrid({ products }: { products: ShowcaseProduct[] }) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
          Collection Vedette
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Sélections triées sur le volet des marques les plus recherchées au
          monde
        </p>
      </div>

      {/* Grille uniforme : toutes les cartes ont la même taille. */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover-lift bg-card/50 backdrop-blur-sm"
          >
            <Link
              href={`/product/${product.id}`}
              className="focus-ring rounded-lg block"
            >
              <div className="relative aspect-square overflow-hidden">
                <ProductImage
                  src={product.thumbnail_url}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <span className="bg-white text-black font-semibold px-6 py-3 shadow-xl rounded-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Aperçu Rapide
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-bold text-muted-foreground mb-1 tracking-wider">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-base mb-2 group-hover:text-accent transition-colors duration-300 leading-tight line-clamp-1">
                  {product.name}
                </h3>
                <span className="text-lg font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="px-10 py-4 bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 font-semibold"
        >
          <Link href="/category/all">Voir Tous les Produits</Link>
        </Button>
      </div>
    </section>
  );
}
