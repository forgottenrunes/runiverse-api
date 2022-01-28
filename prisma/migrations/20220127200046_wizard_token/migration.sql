-- AlterTable
ALTER TABLE "lore" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_image" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "lore_updates" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- AlterTable
ALTER TABLE "token" ALTER COLUMN "id" SET DEFAULT (uuid_generate_v4());

-- CreateTable
CREATE TABLE "wizard" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" UUID NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "background" TEXT,
    "backgroundColor" TEXT,
    "body" TEXT,
    "head" TEXT,
    "prop" TEXT,
    "familiar" TEXT,
    "rune" TEXT,
    "isBurnt" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wizard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wizard" ADD CONSTRAINT "wizard_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
