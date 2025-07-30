-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('ADET', 'DESTE', 'PAKET');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "unit" "ProductUnit" NOT NULL DEFAULT 'ADET';
