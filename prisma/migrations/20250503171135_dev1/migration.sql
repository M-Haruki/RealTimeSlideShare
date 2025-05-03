-- CreateTable
CREATE TABLE "Presentations" (
    "presentation_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "total_page" INTEGER NOT NULL,
    "current_page" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Slides" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "presentation_id" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "content" BLOB NOT NULL
);
