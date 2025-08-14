-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "vatRate" INTEGER;
