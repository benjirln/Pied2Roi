import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductCatalog } from "@/components/product-catalog"

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ProductCatalog />
      <Footer />
    </main>
  )
}
