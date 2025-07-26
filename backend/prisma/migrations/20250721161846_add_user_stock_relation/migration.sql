/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Stock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,userId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_userId_key" ON "Stock"("productId", "userId");
