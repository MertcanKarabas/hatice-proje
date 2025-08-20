-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "customerNewBalance" DECIMAL(18,2) DEFAULT 0,
ADD COLUMN     "customerPreviousBalance" DECIMAL(18,2) DEFAULT 0;
