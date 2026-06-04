-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN "repliedAt" DATETIME;
ALTER TABLE "Inquiry" ADD COLUMN "reply" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "colors" TEXT;
ALTER TABLE "Product" ADD COLUMN "images" TEXT;
ALTER TABLE "Product" ADD COLUMN "sizes" TEXT;
ALTER TABLE "Product" ADD COLUMN "subCategory" TEXT;

-- CreateTable
CREATE TABLE "CollectionMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "eyebrow" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'percentage',
    "discount" REAL,
    "collections" TEXT,
    "code" TEXT,
    "endsAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "image" TEXT,
    "description" TEXT,
    "badge" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentType" TEXT NOT NULL DEFAULT 'Jewellery',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionMeta_name_key" ON "CollectionMeta"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
