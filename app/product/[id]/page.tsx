import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProductDetail } from "@/components/product-detail";
import { db } from "@/boot/db";

interface ProductVariantSize {
  id: string;
  size: string;
  quantity: number;
}

export interface BetterProductVariant {
  color: string;
  thumbnailUrl: string | null;
  sizes: ProductVariantSize[];
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await db
    .selectFrom("product")
    .where("id", "=", params.id)
    .selectAll()
    .executeTakeFirstOrThrow();

  const brand = await db
    .selectFrom("brand")
    .where("id", "=", product.brand_id)
    .selectAll()
    .executeTakeFirstOrThrow();

  const variants = await db
    .selectFrom("product_variant")
    .where("product_id", "=", product.id)
    .selectAll()
    .execute();

  const preparedVariants = Object.values(
    variants.reduce<Record<string, BetterProductVariant>>((acc, variant) => {
      const variantInAcc = acc[variant.color];

      if (variantInAcc) {
        variantInAcc.sizes.push({
          id: variant.id,
          size: variant.size,
          quantity: variant.stock_quantity,
        });

        return acc;
      }

      acc[variant.color] = {
        color: variant.color,
        thumbnailUrl: variant.thumbnail_url,
        sizes: [
          {
            id: variant.id,
            size: variant.size,
            quantity: variant.stock_quantity,
          },
        ],
      };

      return acc;
    }, {}),
  );

  const images = await db
    .selectFrom("product_image")
    .where("product_id", "=", product.id)
    .selectAll()
    .execute();

  return (
    <main className="min-h-screen">
      <Navigation />
      <ProductDetail
        product={product}
        variants={preparedVariants}
        images={images}
        brand={brand.name}
      />
      <Footer />
    </main>
  );
}
