import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const featuredProducts = [
  {
    id: 1,
    brand: "NIKE",
    name: "Air Jordan 1 Retro High",
    price: "180,00 €",
    image: "/nike-air-jordan-1-sneaker-product-shot.jpg",
    isNew: true,
    size: "large",
  },
  {
    id: 2,
    brand: "ADIDAS ORIGINALS",
    name: "Samba Classic",
    price: "125,00 €",
    promotionalPrice: "90,00 €",
    image: "/adidas-samba-sneaker-product-shot.jpg",
    isNew: false,
    size: "medium",
  },
  {
    id: 3,
    brand: "NEW BALANCE",
    name: "990v5 Made in USA",
    price: "220,00 €",
    image: "/new-balance-990v5-sneaker-product-shot.jpg",
    isNew: true,
    size: "medium",
  },
  {
    id: 4,
    brand: "VANS",
    name: "Old Skool Classic",
    price: "75,00 €",
    image: "/vans-old-skool-sneaker-product-shot.jpg",
    isNew: false,
    size: "small",
  },
  {
    id: 5,
    brand: "CONVERSE",
    name: "Chuck Taylor All Star",
    price: "65,00 €",
    image: "/converse-chuck-taylor-sneaker-product-shot.jpg",
    isNew: false,
    size: "small",
  },
  {
    id: 6,
    brand: "PUMA",
    name: "Suede Classic XXI",
    price: "95,00 €",
    image: "/puma-suede-classic-sneaker-product-shot.jpg",
    isNew: true,
    size: "large",
  },
]

export function ProductGrid() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Collection Vedette</h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Sélections triées sur le volet des marques les plus recherchées au monde
        </p>
      </div>

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 auto-rows-fr">
        {featuredProducts.map((product) => (
          <Card
            key={product.id}
            className={`group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover-lift bg-card/50 backdrop-blur-sm ${
              product.size === "large"
                ? "md:col-span-2 md:row-span-2"
                : product.size === "medium"
                  ? "md:col-span-2"
                  : "md:col-span-1"
            }`}
          >
            <Link href={`/product/${product.id}`} className="focus-ring rounded-lg">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                    NOUVEAU
                  </div>
                )}
                {product.promotionalPrice && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                    PROMO
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <Button className="bg-white text-black hover:bg-accent hover:text-accent-foreground font-semibold px-6 py-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Aperçu Rapide
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm font-bold text-muted-foreground mb-2 tracking-wider">{product.brand}</p>
                <h3 className="font-semibold text-lg mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  {product.promotionalPrice ? (
                    <>
                      <span className="text-xl font-bold text-accent">{product.promotionalPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">{product.price}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold">{product.price}</span>
                  )}
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <Button
          size="lg"
          variant="outline"
          className="px-10 py-4 bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 font-semibold"
        >
          Voir Tous les Produits
        </Button>
      </div>
    </section>
  )
}
