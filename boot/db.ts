import {
  KyselyDatabaseDefinition,
  KyselyInstance,
} from "@/kysely/kysely.types";
import { Environment } from "@/lib/utils/environment";
import { Kysely, MysqlDialect, MysqlDialectConfig } from "kysely";
import { createPool } from "mysql2/promise";
import { DB_VERBOSE } from "@/lib/globals";

export const dialectConfig: MysqlDialectConfig = {
  pool: createPool({
    host: Environment.get("MYSQL_HOST"),
    user: Environment.get("MYSQL_USER"),
    password: Environment.get("MYSQL_PASSWORD"),
    database: Environment.get("MYSQL_DATABASE"),

    typeCast: (field, next) => {
      switch (field.type) {
        case "TINY": {
          const fieldString = field.string();
          return fieldString ? fieldString === "1" : null;
        }
        case "DATETIME": {
          const fieldString = field.string();
          return fieldString ? new Date(fieldString) : null;
        }
        case "JSON": {
          const fieldString = field.string();
          return fieldString ? JSON.stringify(fieldString) : null;
        }
        default:
          return next();
      }
    },
  }),
};

export const db: KyselyInstance = new Kysely<KyselyDatabaseDefinition>({
  log: DB_VERBOSE ? ["query", "error"] : undefined,
  dialect: new MysqlDialect(dialectConfig),
});
