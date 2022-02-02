CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "LoreBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "LoreBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenContract" CITEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreImage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "href" TEXT NOT NULL,
    "loreId" UUID NOT NULL,

    CONSTRAINT "LoreImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lore" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rawContent" JSONB,
    "backgroundColor" TEXT,
    "markdownText" TEXT,
    "previewText" TEXT,
    "tokenId" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "parentLoreIndex" INTEGER NOT NULL,
    "loreMetadataURI" TEXT,
    "txHash" TEXT NOT NULL,
    "createdAtBlock" BIGINT NOT NULL,
    "nsfw" BOOLEAN NOT NULL,
    "struck" BOOLEAN NOT NULL,
    "discordNotified" BOOLEAN NOT NULL DEFAULT false,
    "twitterNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreContract" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenContract" CITEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LoreContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wizard" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

    CONSTRAINT "Wizard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soul" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" UUID NOT NULL,
    "transmutedFromTokenId" UUID NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "background" TEXT,
    "backgroundColor" TEXT,
    "body" TEXT,
    "head" TEXT,
    "prop" TEXT,
    "familiar" TEXT,
    "rune" TEXT,
    "burnIndex" INTEGER NOT NULL,

    CONSTRAINT "Soul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoulsBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "SoulsBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoreBlockUpdate_upToBlockNumber_key" ON "LoreBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Token_tokenContract_tokenId_key" ON "Token"("tokenContract", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "LoreImage_loreId_href_key" ON "LoreImage"("loreId", "href");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_txHash_key" ON "Lore"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "LoreContract_tokenContract_key" ON "LoreContract"("tokenContract");

-- CreateIndex
CREATE UNIQUE INDEX "LoreContract_slug_key" ON "LoreContract"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LoreContract_order_key" ON "LoreContract"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Wizard_tokenId_key" ON "Wizard"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Soul_tokenId_key" ON "Soul"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Soul_transmutedFromTokenId_key" ON "Soul"("transmutedFromTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "SoulsBlockUpdate_upToBlockNumber_key" ON "SoulsBlockUpdate"("upToBlockNumber");

-- AddForeignKey
ALTER TABLE "LoreImage" ADD CONSTRAINT "LoreImage_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wizard" ADD CONSTRAINT "Wizard_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soul" ADD CONSTRAINT "Soul_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soul" ADD CONSTRAINT "Soul_transmutedFromTokenId_fkey" FOREIGN KEY ("transmutedFromTokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
