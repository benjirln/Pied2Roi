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
  await exec(db.schema.dropTable("product").ifExists());
  await exec(db.schema.dropTable("user").ifExists());
  await exec(db.schema.dropTable("user_session").ifExists());
  await exec(db.schema.dropTable("order").ifExists());
  await exec(db.schema.dropTable("order_item").ifExists());

  await exec(
    db.schema
      .createTable("brand")
      .ifNotExists()
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("name", "varchar(100)", (col) => col.notNull())
      .addColumn("logo_url", "varchar(255)")
      .addColumn("created_at", "datetime(3)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("category")
      .ifNotExists()
      .addColumn("id", "varchar(60)", (col) => col.primaryKey())
      .addColumn("name", "varchar(100)", (col) => col.notNull())
      .addColumn("slug", "varchar(100)", (col) => col.notNull()),
  );

  await exec(
    db.schema
      .createTable("product")
      .ifNotExists()
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
      .ifNotExists()
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
      .addColumn("thumbnail_url", "text")
      .addColumn("size", "varchar(10)", (col) => col.notNull())
      .addColumn("product_id", "varchar(60)", (col) =>
        col.references("product.id").notNull(),
      ),
  );
}

execute(main);
