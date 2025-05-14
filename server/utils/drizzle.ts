import { drizzle as drizzle_sqlite } from "drizzle-orm/libsql";
import { drizzle as drizzle_mysql } from "drizzle-orm/mysql2";
import * as schema from "../database/schema";

export { sql, eq, and, or } from "drizzle-orm";

let drizzle_: any;

switch (process.env.DATABASE_TYPE) {
    case "mysql":
        // MySQLのDrizzle ORMを使用する場合の処理
        drizzle_ = drizzle_mysql({
            connection: {
                uri: process.env.DATABASE_URL!,
            },
        });
        break;
    case "sqlite":
        drizzle_ = drizzle_sqlite({
            connection: {
                url: process.env.DATABASE_URL!,
            },
        });
        break;
    default:
        throw new Error("Invalid database type");
}

export function useDrizzle() {
    return drizzle_;
}

export const tables = schema;

// export type Presentations = typeof schema.presentations.$inferSelect;
// export type Slides = typeof schema.slides.$inferSelect;
