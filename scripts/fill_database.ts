import { execute } from "@/lib/utils/execute";
import sneakersCourirFemme from "../sneakers_courir_femme.json";
import sneakersCourirHomme from "../sneakers_courir_homme.json";
import { parallel } from "@/lib/utils/parallel";
import { db } from "@/boot/db";
import { Logger } from "@/lib/utils/logger";
import { v7 } from "uuid";

const now = new Date();

const logger = new Logger("db:fill_database");

async function main() {
  const womenId = v7();
  const menId = v7();

  await db
    .insertInto("category")
    .values({
      id: womenId,
      name: "Femme",
      slug: "femme",
    })
    .execute();

  await db
    .insertInto("category")
    .values({
      id: menId,
      name: "Homme",
      slug: "homme",
    })
    .execute();

  function handleProduct(categoryId: string) {
    return async (product: {
      brand: string;
      name: string;
      price: number | null;
      image: string;
      detailUrl: string;
      sizes: string[];
      colors: {
        colorName: string;
        colorUrl: string;
      }[];
      description: string;
      sku: string;
    }) => {
      let brandId: string;

      const brand = await db
        .selectFrom("brand")
        .where("name", "=", product.brand)
        .selectAll()
        .executeTakeFirst();

      if (brand) {
        brandId = brand.id;
      } else {
        brandId = v7();

        await db
          .insertInto("brand")
          .values({
            id: brandId,
            name: product.brand,
            created_at: new Date(),
          })
          .execute();

        logger.info(`Created new brand '${product.brand}'`);
      }

      const productId = v7();

      await db
        .insertInto("product")
        .values({
          id: productId,
          brand_id: brandId,
          name: product.name,
          price: product.price!,
          description: product.description,
          created_at: now,
          active: true,
          updated_at: now,
          category_id: categoryId,
          scraped_from: "courir",
          thumbnail_url: product.image,
        })
        .execute();

      logger.info(`Created new product '${product.name}'`);

      for (const [index, color] of product.colors.entries()) {
        await db
          .insertInto("product_image")
          .values({
            id: v7(),
            product_id: productId,
            display_order: index,
            url: color.colorUrl,
          })
          .execute();

        logger.info(
          `Persisted product image ${color.colorUrl} for product '${product.name}'`,
        );

        await Promise.all(
          product.sizes.map(async (size) => {
            const variantId = v7();
            await db
              .insertInto("product_variant")
              .values({
                id: variantId,
                size,
                color: color.colorName,
                created_at: now,
                product_id: productId,
                stock_quantity: Math.floor(Math.random() * 20),
                thumbnail_url: color.colorUrl,
              })
              .execute();
            logger.info(
              `Created a variant for product '${product.name}' with size '${size}' and color '${color.colorName}'`,
            );
          }),
        );
      }
    };
  }

  await parallel(sneakersCourirHomme, 50, handleProduct(menId));
  await parallel(sneakersCourirFemme, 50, handleProduct(womenId));
}

execute(main, "db:fill_database");
