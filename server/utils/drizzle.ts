import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../database/schema";

export { sql, eq, and, or } from "drizzle-orm";

export function useDrizzle() {
    return drizzle({
        connection: {
            url: process.env.DATABASE_URL!,
        },
    });
}

export const tables = schema;

// export type Presentations = typeof schema.presentations.$inferSelect;
// export type Slides = typeof schema.slides.$inferSelect;
