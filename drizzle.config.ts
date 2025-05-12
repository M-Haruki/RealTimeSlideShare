import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    out: "./server/database/migrations",
    schema: "./server/database/schema.ts",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
