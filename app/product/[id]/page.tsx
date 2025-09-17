import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ProductDetail productId={params.id} />
      <Footer />
    </main>
  )
}
