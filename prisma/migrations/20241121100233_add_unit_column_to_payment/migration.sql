/*
  Warnings:

  - Added the required column `unit` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "unit" VARCHAR(50) NOT NULL ;

