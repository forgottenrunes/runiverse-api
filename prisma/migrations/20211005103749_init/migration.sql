CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "LoreUpdates" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "LoreUpdates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreToken" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "tokenContract" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "LoreToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lore" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" JSONB,
    "loreTokenId" UUID NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "LoreUpdates_upToBlockNumber_key" ON "LoreUpdates"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LoreToken_tokenContract_tokenId_key" ON "LoreToken"("tokenContract", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_txHash_key" ON "Lore"("txHash");

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_loreTokenId_fkey" FOREIGN KEY ("loreTokenId") REFERENCES "LoreToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
