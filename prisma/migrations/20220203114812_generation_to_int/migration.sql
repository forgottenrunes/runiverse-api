/*
  Warnings:

  - The `generation` column on the `Pony` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pony" DROP COLUMN "generation",
ADD COLUMN     "generation" INTEGER;
