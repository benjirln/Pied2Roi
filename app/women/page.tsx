import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategoryPage } from "@/components/category-page"

export default function WomenPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <CategoryPage
        category="women"
        title="Women's Sneakers"
        description="Explore our curated selection of women's sneakers combining style and performance"
        heroImage="/womens-sneakers-collection-hero.jpg"
      />
      <Footer />
    </main>
  )
}
