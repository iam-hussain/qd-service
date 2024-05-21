-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "scheduledAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "note" TEXT;
