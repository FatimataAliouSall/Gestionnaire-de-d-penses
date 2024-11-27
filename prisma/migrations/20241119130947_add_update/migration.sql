/*
  Warnings:

  - You are about to drop the column `amount` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "amount",
DROP COLUMN "endDate",
DROP COLUMN "frequency",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "Planning" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;
