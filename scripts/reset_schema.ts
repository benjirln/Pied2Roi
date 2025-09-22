import { Logger } from "@/lib/utils/logger";
import { Compilable } from "kysely";
import { execute } from "@/lib/utils/execute";
import { db } from "@/boot/db";

const logger = new Logger("db:reset_schema");

async function exec(intent: Compilable & { execute(): Promise<any> }) {
  const before = Date.now();
  const compiledQuery = intent.compile();

  await intent.execute();
  const after = Date.now();
  logger.info(`Intent executed in ${after - before}ms`, compiledQuery.sql);
}

async function main() {
  await exec(db.schema.dropTable("brand").ifExists());
  await exec(db.schema.dropTable("category").ifExists());
  await exec(db.schema.dropTable("product").ifExists());
  await exec(db.schema.dropTable("product_image").ifExists());
  await exec(db.schema.dropTable("product_variant").ifExists());
  await exec(db.schema.dropTable("user").ifExists());
  await exec(db.schema.dropTable("user_session").ifExists());
  await exec(db.schema.dropTable("order").ifExists());
  await exec(db.schema.dropTable("order_item").ifExists());
  await exec(db.schema.dropTable("shopping_cart").ifExists());
  await exec(db.schema.dropTable("shopping_cart_item").ifExists());

  await exec(
    db.schema
      .createTable("brand")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("name", "varchar(100)", (col) => col.notNull())
      .addColumn("logo_url", "varchar(255)")
      .addColumn("created_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("category")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("name", "varchar(100)", (col) => col.notNull())
      .addColumn("slug", "varchar(100)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("product")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("name", "varchar(255)", (col) => col.notNull())
      .addColumn("brand_id", "varchar(60)", (col) =>
        col.references("brand.id").notNull(),
      )
      .addColumn("category_id", "varchar(60)", (col) =>
        col.references("category.id").notNull(),
      )
      .addColumn("description", "text")
      .addColumn("thumbnail_url", "text")
      .addColumn("price", "integer", (col) => col.notNull())
      .addColumn("active", "boolean", (col) => col.notNull())
      .addColumn("scraped_from", "varchar(255)", (col) => col.notNull())
      .addColumn("created_at", "datetime(3)", (col) => col.notNull())
      .addColumn("updated_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("product_image")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("product_id", "varchar(60)", (col) =>
        col.references("product.id").notNull(),
      )
      .addColumn("display_order", "integer", (col) => col.notNull())
      .addColumn("url", "text", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("product_variant")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("product_id", "varchar(60)", (col) =>
        col.references("product.id").notNull(),
      )
      .addColumn("size", "varchar(10)", (col) => col.notNull())
      .addColumn("color", "varchar(50)", (col) => col.notNull())
      .addColumn("stock_quantity", "integer", (col) => col.notNull())
      .addColumn("created_at", "datetime(3)", (col) => col.notNull())
      .addColumn("thumbnail_url", "text"),
  );

  await exec(
    db.schema
      .createTable("user")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("email", "varchar(255)", (col) => col.notNull())
      .addColumn("first_name", "varchar(100)", (col) => col.notNull())
      .addColumn("last_name", "varchar(100)", (col) => col.notNull())
      .addColumn("role", "integer", (col) => col.notNull())
      .addColumn("verified", "boolean", (col) => col.notNull())
      .addColumn("active", "boolean", (col) => col.notNull())
      .addColumn("created_at", "datetime(3)", (col) => col.notNull())
      .addColumn("updated_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("user_session")
      .addColumn("id", "varchar(60)", (col) => col.notNull())
      .addColumn("user_id", "varchar(60)", (col) =>
        col.references("user.id").notNull(),
      )
      .addColumn("expires_at", "datetime(3)", (col) => col.notNull())
      .addColumn("created_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("order")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("user_id", "varchar(60)", (col) =>
        col.references("user.id").notNull(),
      )
      .addColumn("status", "varchar(20)", (col) => col.notNull())
      .addColumn("payment_status", "varchar(20)", (col) => col.notNull())
      .addColumn("created_at", "datetime(3)", (col) => col.notNull())
      .addColumn("updated_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("order_item")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("order_id", "varchar(60)", (col) =>
        col.references("order.id").notNull(),
      )
      .addColumn("product_variant_id", "varchar(60)", (col) =>
        col.references("product_variant.id").notNull(),
      )
      .addColumn("quantity", "integer", (col) => col.notNull())
      .addColumn("unit_price", "integer", (col) => col.notNull())
      .addColumn("total_price", "integer", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("shopping_cart")
      .addColumn("id", "varchar(60)")
      .addColumn("user_id", "varchar(60)", (col) =>
        col.references("user.id").unique().notNull(),
      )
      .addColumn("created_at", "datetime(3)", (col) => col.notNull())
      .addColumn("updated_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("shopping_cart_item")
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("shopping_cart_id", "varchar(60)", (col) =>
        col.references("shopping_cart.id").notNull(),
      )
      .addColumn("product_variant_id", "varchar(60)", (col) =>
        col.references("product_variant.id").notNull(),
      )
      .addColumn("quantity", "integer", (col) => col.notNull())
      .addColumn("unit_price", "integer", (col) => col.notNull())
      .addColumn("total_price", "integer", (col) => col.notNull()),
  );
}

execute(main, "db:reset_schema");
