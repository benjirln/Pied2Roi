"use server";

import { revalidatePath } from "next/cache";
import { v7 } from "uuid";
import { db } from "@/boot/db";
import { requireBackOffice } from "@/lib/auth/guard";
import { isAdmin } from "@/lib/auth/roles";
import {
  getAdminProductVariants,
  type AdminVariant,
} from "@/lib/products/admin-queries";

export async function fetchVariants(
  productId: string,
): Promise<AdminVariant[]> {
  await requireBackOffice();
  return getAdminProductVariants(productId);
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  softDeleted?: boolean;
}

export interface ProductInput {
  id?: string;
  name: string;
  priceEuros: string; // ex "129,90"
  description: string;
  thumbnailUrl: string;
  brandId: string;
  newBrand?: string;
  categoryId: string;
  active: boolean;
}

function parsePriceToCents(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}

async function resolveBrandId(
  brandId: string,
  newBrand?: string,
): Promise<string | null> {
  const name = newBrand?.trim();
  if (name) {
    const existing = await db
      .selectFrom("brand")
      .where("name", "=", name)
      .select("id")
      .executeTakeFirst();
    if (existing) return existing.id;

    const id = v7();
    await db
      .insertInto("brand")
      .values({ id, name, created_at: new Date() })
      .execute();
    return id;
  }
  return brandId || null;
}

function revalidateShop() {
  // Rafraîchit la home, le back-office, les catégories et les fiches produit.
  revalidatePath("/", "layout");
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  await requireBackOffice();

  if (!input.name.trim()) return { ok: false, error: "Le nom est requis" };
  const price = parsePriceToCents(input.priceEuros);
  if (price === null) return { ok: false, error: "Prix invalide" };
  if (!input.categoryId) return { ok: false, error: "Catégorie requise" };

  const brandId = await resolveBrandId(input.brandId, input.newBrand);
  if (!brandId) return { ok: false, error: "Marque requise" };

  const now = new Date();
  const productId = v7();

  await db
    .insertInto("product")
    .values({
      id: productId,
      name: input.name.trim(),
      brand_id: brandId,
      category_id: input.categoryId,
      description: input.description ?? "",
      thumbnail_url: input.thumbnailUrl || null,
      price,
      active: input.active,
      scraped_from: "manual",
      created_at: now,
      updated_at: now,
    })
    .execute();

  if (input.thumbnailUrl) {
    await db
      .insertInto("product_image")
      .values({
        id: v7(),
        product_id: productId,
        display_order: 0,
        url: input.thumbnailUrl,
      })
      .execute();
  }

  revalidateShop();
  return { ok: true };
}

export async function updateProduct(input: ProductInput): Promise<ActionResult> {
  await requireBackOffice();
  if (!input.id) return { ok: false, error: "Produit introuvable" };
  if (!input.name.trim()) return { ok: false, error: "Le nom est requis" };

  const price = parsePriceToCents(input.priceEuros);
  if (price === null) return { ok: false, error: "Prix invalide" };

  const brandId = await resolveBrandId(input.brandId, input.newBrand);
  if (!brandId) return { ok: false, error: "Marque requise" };

  await db
    .updateTable("product")
    .set({
      name: input.name.trim(),
      brand_id: brandId,
      category_id: input.categoryId,
      description: input.description ?? "",
      thumbnail_url: input.thumbnailUrl || null,
      price,
      active: input.active,
      updated_at: new Date(),
    })
    .where("id", "=", input.id)
    .execute();

  revalidateShop();
  return { ok: true };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const user = await requireBackOffice();
  // La suppression est réservée à l'administrateur.
  if (!isAdmin(user.role)) {
    return { ok: false, error: "Suppression réservée à l'administrateur" };
  }

  try {
    await db
      .deleteFrom("product_image")
      .where("product_id", "=", productId)
      .execute();
    await db
      .deleteFrom("product_variant")
      .where("product_id", "=", productId)
      .execute();
    await db.deleteFrom("product").where("id", "=", productId).execute();
    revalidateShop();
    return { ok: true };
  } catch {
    // Le produit est référencé par des commandes : on le désactive plutôt.
    await db
      .updateTable("product")
      .set({ active: false, updated_at: new Date() })
      .where("id", "=", productId)
      .execute();
    revalidateShop();
    return { ok: true, softDeleted: true };
  }
}

export async function addVariant(input: {
  productId: string;
  size: string;
  color: string;
  stock: number;
}): Promise<ActionResult> {
  await requireBackOffice();
  if (!input.size.trim() || !input.color.trim()) {
    return { ok: false, error: "Taille et couleur requises" };
  }
  const stock = Math.max(0, Math.floor(Number(input.stock) || 0));

  const product = await db
    .selectFrom("product")
    .where("id", "=", input.productId)
    .select("thumbnail_url")
    .executeTakeFirst();

  await db
    .insertInto("product_variant")
    .values({
      id: v7(),
      product_id: input.productId,
      size: input.size.trim(),
      color: input.color.trim(),
      stock_quantity: stock,
      created_at: new Date(),
      thumbnail_url: product?.thumbnail_url ?? null,
    })
    .execute();

  revalidateShop();
  return { ok: true };
}

export async function updateVariantStock(
  variantId: string,
  stock: number,
): Promise<ActionResult> {
  await requireBackOffice();
  const value = Math.max(0, Math.floor(Number(stock) || 0));

  await db
    .updateTable("product_variant")
    .set({ stock_quantity: value })
    .where("id", "=", variantId)
    .execute();

  revalidateShop();
  return { ok: true };
}

export async function deleteVariant(variantId: string): Promise<ActionResult> {
  await requireBackOffice();
  try {
    await db
      .deleteFrom("product_variant")
      .where("id", "=", variantId)
      .execute();
    revalidateShop();
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Variante liée à une commande, suppression impossible",
    };
  }
}
