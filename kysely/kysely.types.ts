import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";

export type KyselyDatabaseDefinition = DB;

export type KyselyInstance = Kysely<KyselyDatabaseDefinition>;
