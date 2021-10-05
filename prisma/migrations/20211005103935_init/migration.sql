-- AlterTable
ALTER TABLE "Lore" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "LoreToken" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "LoreUpdates" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());
