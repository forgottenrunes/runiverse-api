-- CreateTable
CREATE TABLE "WizardOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "WizardOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoulOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "SoulOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WizardOwnershipBlockUpdate_upToBlockNumber_key" ON "WizardOwnershipBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SoulOwnershipBlockUpdate_upToBlockNumber_key" ON "SoulOwnershipBlockUpdate"("upToBlockNumber");
