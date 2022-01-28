/*
  Warnings:

  - You are about to drop the `lore_updates` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "lore" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_image" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "wizard" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- DropTable
DROP TABLE "lore_updates";

-- CreateTable
CREATE TABLE "lore_update" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "lore_update_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lore_update_upToBlockNumber_key" ON "lore_update"("upToBlockNumber");
