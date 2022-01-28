/*
  Warnings:

  - A unique constraint covering the columns `[loreId,href]` on the table `lore_image` will be added. If there are existing duplicate values, this will fail.
  - Made the column `href` on table `lore_image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "lore" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_image" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4()),
ALTER COLUMN "href" SET NOT NULL;

-- AlterTable
ALTER TABLE "lore_updates" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- CreateIndex
CREATE UNIQUE INDEX "lore_image_loreId_href_key" ON "lore_image"("loreId", "href");
