import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckoutPage } from "@/components/checkout/checkout-page"

export default function Checkout() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <CheckoutPage />
      <Footer />
    </main>
  )
}
