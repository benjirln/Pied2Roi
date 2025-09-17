import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategoryPage } from "@/components/category-page"

export default function MenPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <CategoryPage
        category="men"
        title="Men's Sneakers"
        description="Discover our premium collection of men's sneakers from the world's most coveted brands"
        heroImage="/mens-sneakers-collection-hero.jpg"
      />
      <Footer />
    </main>
  )
}
