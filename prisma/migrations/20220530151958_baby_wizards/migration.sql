-- CreateTable
CREATE TABLE "BabyWizard" (
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

    CONSTRAINT "BabyWizard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyWizardBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "BabyWizardBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyWizardOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "BabyWizardOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BabyWizard_tokenId_key" ON "BabyWizard"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "BabyWizardBlockUpdate_upToBlockNumber_key" ON "BabyWizardBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BabyWizardOwnershipBlockUpdate_upToBlockNumber_key" ON "BabyWizardOwnershipBlockUpdate"("upToBlockNumber");

-- AddForeignKey
ALTER TABLE "BabyWizard" ADD CONSTRAINT "BabyWizard_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
