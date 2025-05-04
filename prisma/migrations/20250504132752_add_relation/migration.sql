-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Slides" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "presentation_id" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "content" BLOB NOT NULL,
    CONSTRAINT "Slides_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "Presentations" ("presentation_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Slides" ("content", "page", "presentation_id", "uuid") SELECT "content", "page", "presentation_id", "uuid" FROM "Slides";
DROP TABLE "Slides";
ALTER TABLE "new_Slides" RENAME TO "Slides";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
