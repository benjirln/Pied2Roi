import { execute } from "@/lib/utils/execute";
import sneakersCourirFemme from "../sneakers_courir_femme.json";
import sneakersCourirHomme from "../sneakers_courir_homme.json";
import { db } from "@/boot/db";
import { Logger } from "@/lib/utils/logger";
import { hashPassword } from "@/lib/auth/password";
import { Role } from "@/lib/auth/roles";
import { v7 } from "uuid";

const logger = new Logger("db:fill_database");
const now = new Date();

interface RawProduct {
  brand: string;
  name: string;
  price: string;
  promotionalprice?: string;
  image: string;
  detailUrl: string;
  sizes: string[];
  colors: { colorName: string; colorUrl: string }[];
  description: string;
  sku: string;
}

const homme = sneakersCourirHomme as unknown as RawProduct[];
const femme = sneakersCourirFemme as unknown as RawProduct[];

// Pointures réalistes pour la catégorie enfant (la consigne impose 3 catégories).
const KID_SIZES = ["28", "29", "30", "31", "32", "33", "34", "35"];
const MAX_COLORS_PER_PRODUCT = 5;

/** "120,00 €" -> 12000 (centimes). Renvoie null si non parsable. */
function parsePriceToCents(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.round(value * 100);
}

function randomStock(): number {
  // ~15% de variantes en rupture pour un stock crédible.
  const r = Math.random();
  if (r < 0.15) return 0;
  return Math.floor(Math.random() * 25) + 1;
}

// Lignes à insérer en masse.
const brandRows: { id: string; name: string; created_at: Date }[] = [];
const productRows: any[] = [];
const imageRows: any[] = [];
const variantRows: any[] = [];

const brandIdByName = new Map<string, string>();

function getBrandId(name: string): string {
  const key = name.trim();
  const existing = brandIdByName.get(key);
  if (existing) return existing;

  const id = v7();
  brandIdByName.set(key, id);
  brandRows.push({ id, name: key, created_at: now });
  return id;
}

function buildProduct(
  raw: RawProduct,
  categoryId: string,
  sizes: string[],
): void {
  const price = parsePriceToCents(raw.price);
  if (price === null || !raw.brand?.trim() || !raw.name?.trim()) {
    return;
  }

  const brandId = getBrandId(raw.brand);
  const productId = v7();

  productRows.push({
    id: productId,
    brand_id: brandId,
    category_id: categoryId,
    name: raw.name.trim(),
    description: raw.description ?? "",
    price,
    active: true,
    scraped_from: "courir",
    thumbnail_url: raw.image,
    created_at: now,
    updated_at: now,
  });

  imageRows.push({
    id: v7(),
    product_id: productId,
    display_order: 0,
    url: raw.image,
  });

  // Couleurs distinctes (le scraping fournit des noms de couleur), plafonnées.
  const seenColors = new Set<string>();
  const colors: string[] = [];
  for (const c of raw.colors ?? []) {
    const name = (c.colorName || "").trim() || "Standard";
    if (seenColors.has(name)) continue;
    seenColors.add(name);
    colors.push(name);
    if (colors.length >= MAX_COLORS_PER_PRODUCT) break;
  }
  if (colors.length === 0) colors.push("Standard");

  for (const color of colors) {
    for (const size of sizes) {
      variantRows.push({
        id: v7(),
        product_id: productId,
        size,
        color,
        stock_quantity: randomStock(),
        created_at: now,
        thumbnail_url: raw.image,
      });
    }
  }
}

async function bulkInsert(table: string, rows: any[], chunkSize = 500) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await db
      .insertInto(table as any)
      .values(chunk)
      .execute();
  }
  logger.info(`Inserted ${rows.length} rows into '${table}'`);
}

async function seedUsers() {
  const accounts = [
    {
      email: "admin@pied2roi.fr",
      password: "Admin1234",
      first_name: "Alice",
      last_name: "Admin",
      role: Role.ADMIN,
    },
    {
      email: "vendeur@pied2roi.fr",
      password: "Vendeur1234",
      first_name: "Victor",
      last_name: "Vendeur",
      role: Role.SELLER,
    },
    {
      email: "client@pied2roi.fr",
      password: "Client1234",
      first_name: "Camille",
      last_name: "Client",
      role: Role.CLIENT,
    },
  ];

  for (const account of accounts) {
    await db
      .insertInto("user")
      .values({
        id: v7(),
        email: account.email,
        password_hash: await hashPassword(account.password),
        first_name: account.first_name,
        last_name: account.last_name,
        role: account.role,
        verified: true,
        active: true,
        created_at: now,
        updated_at: now,
      })
      .execute();
    logger.info(`Seeded user ${account.email} (${account.role})`);
  }
}

async function main() {
  // 1. Catégories (homme / femme / enfant)
  const menId = v7();
  const womenId = v7();
  const kidsId = v7();

  await db
    .insertInto("category")
    .values([
      { id: menId, name: "Homme", slug: "homme" },
      { id: womenId, name: "Femme", slug: "femme" },
      { id: kidsId, name: "Enfant", slug: "enfant" },
    ])
    .execute();

  // 2. Comptes de démonstration (3 rôles)
  await seedUsers();

  // 3. Produits homme / femme depuis le scraping Courir
  for (const raw of homme) {
    buildProduct(raw, menId, raw.sizes ?? []);
  }
  for (const raw of femme) {
    buildProduct(raw, womenId, raw.sizes ?? []);
  }

  // 4. Catégorie enfant : déclinaisons en pointures enfant d'un sous-ensemble
  const kidsSource = [...homme.slice(0, 25), ...femme.slice(0, 25)];
  for (const raw of kidsSource) {
    buildProduct(raw, kidsId, KID_SIZES);
  }

  logger.info(
    `Prepared ${brandRows.length} brands, ${productRows.length} products, ${variantRows.length} variants`,
  );

  // 5. Insertions groupées
  await bulkInsert("brand", brandRows);
  await bulkInsert("product", productRows);
  await bulkInsert("product_image", imageRows);
  await bulkInsert("product_variant", variantRows);

  logger.info("Database successfully populated");
}

execute(main, "db:fill_database");
