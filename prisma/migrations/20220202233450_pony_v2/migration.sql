-- CreateTable
CREATE TABLE "Pony" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenId" UUID NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "background" TEXT,
    "backgroundColor" TEXT,
    "clothes" TEXT,
    "head" TEXT,
    "mouth" TEXT,
    "pony" TEXT,
    "rune" TEXT,
    "genes" BIGINT,

    CONSTRAINT "Pony_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pony_tokenId_key" ON "Pony"("tokenId");

-- AddForeignKey
ALTER TABLE "Pony" ADD CONSTRAINT "Pony_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
