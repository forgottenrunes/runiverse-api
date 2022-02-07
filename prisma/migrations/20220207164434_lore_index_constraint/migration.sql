/*
  Warnings:

  - A unique constraint covering the columns `[tokenId,index]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lore_tokenId_index_key" ON "Lore"("tokenId", "index");
