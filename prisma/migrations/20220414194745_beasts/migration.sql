-- CreateTable
CREATE TABLE "Beast" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" UUID NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "background" TEXT,
    "species" TEXT,

    CONSTRAINT "Beast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeastsBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "BeastsBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeastOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "BeastOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Beast_tokenId_key" ON "Beast"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "BeastsBlockUpdate_upToBlockNumber_key" ON "BeastsBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BeastOwnershipBlockUpdate_upToBlockNumber_key" ON "BeastOwnershipBlockUpdate"("upToBlockNumber");

-- AddForeignKey
ALTER TABLE "Beast" ADD CONSTRAINT "Beast_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
