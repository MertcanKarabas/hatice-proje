/*
  Warnings:

  - You are about to drop the column `currency` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "exchangeId" TEXT;

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "currency",
ADD COLUMN     "exchangeId" TEXT;
