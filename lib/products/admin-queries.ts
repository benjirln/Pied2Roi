import { db } from "@/boot/db";

export interface AdminProductRow {
  id: string;
  name: string;
  price: number;
  active: boolean;
  thumbnail_url: string | null;
  brand: string;
  brand_id: string;
  category: string;
  category_id: string;
  stock: number;
  variant_count: number;
}

/** Liste des produits pour le back-office, avec stock total et nb de variantes. */
export async function listAdminProducts(): Promise<AdminProductRow[]> {
  const rows = await db
    .selectFrom("product")
    .innerJoin("brand", "brand.id", "product.brand_id")
    .innerJoin("category", "category.id", "product.category_id")
    .leftJoin("product_variant", "product_variant.product_id", "product.id")
    .select((eb) => [
      "product.id as id",
      "product.name as name",
      "product.price as price",
      "product.active as active",
      "product.thumbnail_url as thumbnail_url",
      "brand.name as brand",
      "brand.id as brand_id",
      "category.name as category",
      "category.id as category_id",
      eb.fn
        .coalesce(eb.fn.sum("product_variant.stock_quantity"), eb.lit(0))
        .as("stock"),
      eb.fn.count("product_variant.id").as("variant_count"),
    ])
    .groupBy(["product.id", "brand.id", "category.id"])
    .orderBy("product.created_at", "desc")
    .execute();

  return rows.map((r) => ({
    ...r,
    stock: Number(r.stock),
    variant_count: Number(r.variant_count),
  }));
}

export interface AdminVariant {
  id: string;
  size: string;
  color: string;
  stock_quantity: number;
}

export async function getAdminProductVariants(
  productId: string,
): Promise<AdminVariant[]> {
  return db
    .selectFrom("product_variant")
    .where("product_id", "=", productId)
    .select(["id", "size", "color", "stock_quantity"])
    .orderBy("color")
    .orderBy("size")
    .execute();
}

export async function getBrandsAndCategories() {
  const [brands, categories] = await Promise.all([
    db.selectFrom("brand").select(["id", "name"]).orderBy("name").execute(),
    db.selectFrom("category").select(["id", "name"]).orderBy("name").execute(),
  ]);
  return { brands, categories };
}
