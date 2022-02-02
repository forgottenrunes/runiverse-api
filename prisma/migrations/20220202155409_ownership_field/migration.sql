-- AlterTable
ALTER TABLE "Lore" ALTER COLUMN "creator" SET DATA TYPE CITEXT;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "currentOwner" CITEXT;
