/*
  Warnings:

  - Made the column `expenseCategoryId` on table `Expense` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_expenseCategoryId_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "expenseCategoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "ExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
