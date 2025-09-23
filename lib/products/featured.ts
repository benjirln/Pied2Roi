import { unstable_cache } from "next/cache";
import { db } from "@/boot/db";

export interface ShowcaseProduct {
  id: string;
  name: string;
  price: number;
  thumbnail_url: string;
  brand: string;
}

export interface ShowcaseDrop extends ShowcaseProduct {
  stock: number;
}

/**
 * Vérifie qu'une URL pointe vers une vraie image et pas un placeholder
 * « image indisponible » du CDN (qui répond 200 mais ~285 octets).
 */
async function imageIsReal(url: string): Promise<boolean> {
  if (!url || !url.startsWith("http")) return false;
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return false;
    const type = res.headers.get("content-type") || "";
    const length = Number(res.headers.get("content-length") || "0");
    return type.startsWith("image/") && length > 1000;
  } catch {
    return false;
  }
}

async function buildShowcase(): Promise<{
  featured: ShowcaseProduct[];
  drops: ShowcaseDrop[];
}> {
  const pool = await db
    .selectFrom("product")
    .innerJoin("brand", "brand.id", "product.brand_id")
    .where("product.active", "=", true)
    .where("product.thumbnail_url", "like", "http%")
    .select([
      "product.id as id",
      "product.name as name",
      "product.price as price",
      "product.thumbnail_url as thumbnail_url",
      "brand.name as brand",
    ])
    .orderBy("product.price", "desc")
    .limit(60)
    .execute();

  // Vérifie les images en parallèle en conservant l'ordre.
  const checks = await Promise.all(pool.map((p) => imageIsReal(p.thumbnail_url)));
  const good = pool.filter((_, i) => checks[i]);

  const drops = good.slice(0, 3);
  const featured = good.slice(3, 9);

  let stockByProduct = new Map<string, number>();
  if (drops.length > 0) {
    const stocks = await db
      .selectFrom("product_variant")
      .select((eb) => [
        "product_id",
        eb.fn.sum<number>("stock_quantity").as("stock"),
      ])
      .where(
        "product_id",
        "in",
        drops.map((d) => d.id),
      )
      .groupBy("product_id")
      .execute();
    stockByProduct = new Map(stocks.map((s) => [s.product_id, Number(s.stock)]));
  }

  return {
    featured,
    drops: drops.map((d) => ({ ...d, stock: stockByProduct.get(d.id) ?? 0 })),
  };
}

// Mis en cache 1 h : on ne revérifie pas les images à chaque visite.
export const getHomeShowcase = unstable_cache(buildShowcase, ["home-showcase-v1"], {
  revalidate: 3600,
});
