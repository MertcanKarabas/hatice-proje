-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('SALES', 'PURCHASE');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "type" "CustomerType" NOT NULL DEFAULT 'SALES';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isPackage" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductComponent" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductComponent_pkey" PRIMARY KEY ("id")
);
