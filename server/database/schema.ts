import { sqliteTable as table_sqlite } from "drizzle-orm/sqlite-core";
import * as t_sqlite from "drizzle-orm/sqlite-core";

import { mysqlTable as table_mysql, customType } from "drizzle-orm/mysql-core";
import * as t_mysql from "drizzle-orm/mysql-core";

import { randomUUID } from "crypto"; // importしなくても開発環境では動くが、production環境ではimportが必須

const mediumBlob = customType<{ data: Buffer }>({
    dataType: () => "mediumblob",
    toDriver: (value: Buffer) => value,
    fromDriver: (value: unknown) => Buffer.from(value as ArrayBuffer),
});

let tables: any;
switch (process.env.DATABASE_TYPE) {
    case "mysql":
        tables = table_mysql;
        break;
    case "sqlite":
        tables = table_sqlite;
        break;
    default:
        throw new Error("Invalid database type");
}
export { tables };

let presentations: any;
switch (process.env.DATABASE_TYPE) {
    case "mysql":
        presentations = table_mysql("presentations", {
            presentation_id: t_mysql.varchar("presentation_id", { length: 16 }).primaryKey(),
            title: t_mysql.varchar("title", { length: 32 }).notNull(),
            total_page: t_mysql.int("total_page").notNull(),
            current_page: t_mysql.int("current_page").notNull().default(0),
            created_at: t_mysql
                .int("created_at")
                .notNull()
                .$defaultFn(() => Math.round(Date.now() / 1000)),
        });
        break;
    case "sqlite":
        presentations = table_sqlite("presentations", {
            presentation_id: t_sqlite.text("presentation_id").primaryKey(),
            title: t_sqlite.text("title").notNull(),
            total_page: t_sqlite.integer("total_page").notNull(),
            current_page: t_sqlite.integer("current_page").notNull().default(0),
            created_at: t_sqlite
                .integer("created_at")
                .notNull()
                .$defaultFn(() => Math.round(Date.now() / 1000)),
        });
        break;
    default:
        throw new Error("Invalid database type");
}
export { presentations };

let slides: any;
switch (process.env.DATABASE_TYPE) {
    case "mysql":
        slides = table_mysql("slides", {
            uuid: t_mysql
                .varchar("uuid", { length: 36 })
                .primaryKey()
                .$defaultFn(() => randomUUID()),
            presentation_id: t_mysql.varchar("presentation_id", { length: 16 }).notNull(),
            page: t_mysql.int("page").notNull(),
            content: mediumBlob("content").notNull(),
        });
        break;
    case "sqlite":
        slides = table_sqlite("slides", {
            uuid: t_sqlite
                .text("uuid")
                .primaryKey()
                .$defaultFn(() => randomUUID()),
            presentation_id: t_sqlite.text("presentation_id").notNull(),
            page: t_sqlite.integer("page").notNull(),
            content: t_sqlite.blob("content").notNull(),
        });
        break;
    default:
        throw new Error("Invalid database type");
}

export { slides };

let log: any;
switch (process.env.DATABASE_TYPE) {
    case "mysql":
        log = table_mysql("log", {
            uuid: t_mysql
                .varchar("uuid", { length: 36 })
                .primaryKey()
                .$defaultFn(() => randomUUID()),
            ip: t_mysql.varchar("ip", { length: 64 }).notNull(),
            action: t_mysql.varchar("action", { length: 32 }).notNull(),
            timestamp: t_mysql
                .int("timestamp")
                .notNull()
                .$defaultFn(() => Math.round(Date.now() / 1000)),
            presentation_id: t_mysql.varchar("presentation_id", { length: 16 }),
        });
        break;
    case "sqlite":
        log = table_sqlite("log", {
            uuid: t_sqlite
                .text("uuid")
                .primaryKey()
                .$defaultFn(() => randomUUID()),
            ip: t_sqlite.text("ip").notNull(),
            action: t_sqlite.text("action").notNull(),
            timestamp: t_sqlite
                .integer("timestamp")
                .notNull()
                .$defaultFn(() => Math.round(Date.now() / 1000)),
            presentation_id: t_sqlite.text("presentation_id"),
        });
        break;
    default:
        throw new Error("Invalid database type");
}

export { log };
