import { db } from "@/boot/db";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { ProductCatalog } from "@/components/product-catalog";
import { Category } from "kysely-codegen";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    brand?: string;
    sort?: string;
    q?: string;
  };
}) {
  let category: Category | undefined;

  if (params.slug !== "all") {
    category = await db
      .selectFrom("category")
      .where("slug", "=", params.slug)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  let productsQuery = db.selectFrom("product").selectAll();

  if (category) {
    productsQuery = productsQuery.where("category_id", "=", category.id);
  }

  if (searchParams.brand && searchParams.brand !== "all") {
    productsQuery = productsQuery.where("brand_id", "=", searchParams.brand);
  }

  switch (searchParams.sort) {
    case "price-low-to-high":
      productsQuery = productsQuery.orderBy("price", "asc");
      break;
    case "price-high-to-low":
      productsQuery = productsQuery.orderBy("price", "desc");
      break;
    case "newest-first":
      productsQuery = productsQuery.orderBy("created_at", "desc");
      break;
    case "model-name":
      productsQuery.orderBy("name", "asc");
      break;
  }

  if (searchParams.q) {
    productsQuery = productsQuery.where("name", "like", `%${searchParams.q}%`);
  }

  const products = await productsQuery.execute();

  const brands = await db.selectFrom("brand").selectAll().execute();
  const categories = await db.selectFrom("category").selectAll().execute();

  return (
    <main className="min-h-screen">
      <Navigation />
      <div>
        {/* Category Hero */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={
                category?.slug === "homme"
                  ? "/mens-sneakers-collection-hero.jpg"
                  : "/womens-sneakers-collection-hero.jpg"
              }
              alt={category?.name ?? "All products"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              {category?.name ?? "All products"}
            </h1>
          </div>
        </section>

        {/* Product Catalog */}
        <ProductCatalog
          slug={params.slug}
          products={products}
          brands={brands}
          categories={categories}
        />
      </div>
      <Footer />
    </main>
  );
}
