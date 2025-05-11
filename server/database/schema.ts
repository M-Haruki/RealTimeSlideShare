import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const presentations = table("presentations", {
    presentation_id: t.text("presentation_id").primaryKey(),
    title: t.text("title").notNull(),
    total_page: t.integer("total_page").notNull(),
    current_page: t.integer("current_page").notNull().default(0),
    created_at: t
        .integer("created_at")
        .notNull()
        .default(Math.round(Date.now() / 1000)),
});

export const slides = table("slides", {
    uuid: t.text("uuid").primaryKey(),
    presentation_id: t.text("presentation_id").notNull(),
    page: t.integer("page").notNull(),
    content: t.blob("content").notNull(),
});
