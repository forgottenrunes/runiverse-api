-- CreateTable
CREATE TABLE "Warrior" (
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
    "weapon" TEXT,
    "companion" TEXT,
    "rune" TEXT,
    "shield" TEXT,

    CONSTRAINT "Warrior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarriorBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "WarriorBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarriorOwnershipBlockUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upToBlockNumber" INTEGER NOT NULL,
    "timeTaken" INTEGER NOT NULL,

    CONSTRAINT "WarriorOwnershipBlockUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warrior_tokenId_key" ON "Warrior"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "WarriorBlockUpdate_upToBlockNumber_key" ON "WarriorBlockUpdate"("upToBlockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WarriorOwnershipBlockUpdate_upToBlockNumber_key" ON "WarriorOwnershipBlockUpdate"("upToBlockNumber");

-- AddForeignKey
ALTER TABLE "Warrior" ADD CONSTRAINT "Warrior_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
