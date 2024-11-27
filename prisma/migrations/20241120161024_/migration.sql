/*
  Warnings:

  - You are about to alter the column `unit` on the `Planning` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Planning" ALTER COLUMN "unit" SET DATA TYPE VARCHAR(50);
