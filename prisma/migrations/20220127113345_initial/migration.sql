CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "lore_updates" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "lore_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "tokenContract" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lore_image" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "href" TEXT,
    "loreId" UUID NOT NULL,

    CONSTRAINT "lore_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lore" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rawContent" JSONB,
    "markdownText" TEXT,
    "previewText" TEXT,
    "loreTokenId" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "parentLoreIndex" INTEGER NOT NULL,
    "loreMetadataURI" TEXT,
    "txHash" TEXT NOT NULL,
    "createdAtBlock" BIGINT NOT NULL,
    "createdAtBlockTimestamp" INTEGER NOT NULL,
    "nsfw" BOOLEAN NOT NULL,
    "struck" BOOLEAN NOT NULL,
    "discordNotified" BOOLEAN NOT NULL DEFAULT false,
    "twitterNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lore_updates_upToBlockNumber_key" ON "lore_updates"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "token_tokenContract_tokenId_key" ON "token"("tokenContract", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "lore_txHash_key" ON "lore"("txHash");

-- AddForeignKey
ALTER TABLE "lore_image" ADD CONSTRAINT "lore_image_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "lore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lore" ADD CONSTRAINT "lore_loreTokenId_fkey" FOREIGN KEY ("loreTokenId") REFERENCES "token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
