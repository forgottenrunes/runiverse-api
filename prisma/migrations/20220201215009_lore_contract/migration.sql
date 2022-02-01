-- CreateTable
CREATE TABLE "LoreContract" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenContract" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LoreContract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoreContract_tokenContract_key" ON "LoreContract"("tokenContract");

-- CreateIndex
CREATE UNIQUE INDEX "LoreContract_slug_key" ON "LoreContract"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LoreContract_order_key" ON "LoreContract"("order");
