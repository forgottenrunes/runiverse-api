/*
  Warnings:

  - You are about to drop the column `createdAtBlockTimestamp` on the `lore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lore" DROP COLUMN "createdAtBlockTimestamp",
ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_image" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_updates" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());
