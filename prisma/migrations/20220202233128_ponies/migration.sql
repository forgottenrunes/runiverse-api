-- CreateTable
CREATE TABLE "PoniesBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "PoniesBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PonyOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "PonyOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PoniesBlockUpdate_upToBlockNumber_key" ON "PoniesBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PonyOwnershipBlockUpdate_upToBlockNumber_key" ON "PonyOwnershipBlockUpdate"("upToBlockNumber");
