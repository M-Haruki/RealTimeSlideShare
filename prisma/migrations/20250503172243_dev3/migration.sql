-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentations" (
    "presentation_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "total_page" INTEGER NOT NULL,
    "current_page" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Presentations" ("created_at", "current_page", "presentation_id", "title", "total_page") SELECT "created_at", "current_page", "presentation_id", "title", "total_page" FROM "Presentations";
DROP TABLE "Presentations";
ALTER TABLE "new_Presentations" RENAME TO "Presentations";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
