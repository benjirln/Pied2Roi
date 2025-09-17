import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { LimitedDrops } from "@/components/limited-drops"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProductGrid />
      <LimitedDrops />
      <NewsletterSignup />
      <Footer />
    </main>
  )
}
