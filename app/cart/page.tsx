import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CartPage } from "@/components/cart/cart-page"

export default function Cart() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <CartPage />
      <Footer />
    </main>
  )
}
