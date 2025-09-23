import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ProductGrid } from "@/components/product-grid";
import { LimitedDrops, type LimitedDrop } from "@/components/limited-drops";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Footer } from "@/components/footer";
import { getHomeShowcase } from "@/lib/products/featured";

export default async function HomePage() {
  const { featured, drops } = await getHomeShowcase();

  const limitedDrops: LimitedDrop[] = drops.map((d) => ({
    id: d.id,
    brand: d.brand,
    name: d.name,
    price: d.price,
    image: d.thumbnail_url,
    stock: d.stock,
  }));

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProductGrid products={featured} />
      <LimitedDrops drops={limitedDrops} />
      <NewsletterSignup />
      <Footer />
    </main>
  );
}
