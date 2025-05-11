-- CreateTable
CREATE TABLE "Presentations" (
    "presentation_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "total_page" INTEGER NOT NULL,
    "current_page" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Slides" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "presentation_id" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "content" BLOB NOT NULL,
    CONSTRAINT "Slides_presentation_id_fkey" FOREIGN KEY ("presentation_id") REFERENCES "Presentations" ("presentation_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
