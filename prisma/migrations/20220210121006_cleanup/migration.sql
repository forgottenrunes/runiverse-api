-- AlterTable
ALTER TABLE "Contract" RENAME CONSTRAINT "LoreContract_pkey" TO "Contract_pkey";

-- RenameIndex
ALTER INDEX "LoreContract_order_key" RENAME TO "Contract_order_key";

-- RenameIndex
ALTER INDEX "LoreContract_slug_key" RENAME TO "Contract_slug_key";

-- RenameIndex
ALTER INDEX "LoreContract_tokenContract_key" RENAME TO "Contract_tokenContract_key";
