-- CreateTable
CREATE TABLE "BeastSpawn" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" UUID NOT NULL,
    "parentBeastId" UUID NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "background" TEXT,
    "species" TEXT,

    CONSTRAINT "BeastSpawn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeastSpawnBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "BeastSpawnBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeastSpawnOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "BeastSpawnOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeastSpawn_tokenId_key" ON "BeastSpawn"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "BeastSpawn_parentBeastId_key" ON "BeastSpawn"("parentBeastId");

-- CreateIndex
CREATE UNIQUE INDEX "BeastSpawnBlockUpdate_upToBlockNumber_key" ON "BeastSpawnBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BeastSpawnOwnershipBlockUpdate_upToBlockNumber_key" ON "BeastSpawnOwnershipBlockUpdate"("upToBlockNumber");

-- AddForeignKey
ALTER TABLE "BeastSpawn" ADD CONSTRAINT "BeastSpawn_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeastSpawn" ADD CONSTRAINT "BeastSpawn_parentBeastId_fkey" FOREIGN KEY ("parentBeastId") REFERENCES "Beast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
