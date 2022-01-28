/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `wizard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "lore" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_image" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_update" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "wizard" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- CreateIndex
CREATE UNIQUE INDEX "wizard_tokenId_key" ON "wizard"("tokenId");
