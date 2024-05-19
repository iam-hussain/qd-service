/*
  Warnings:

  - The values [PROGRESS] on the enum `ITEM_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CATEGORY_TYPE" AS ENUM ('DEFAULT', 'KITCHEN');

-- AlterEnum
BEGIN;
CREATE TYPE "ITEM_STATUS_new" AS ENUM ('DRAFT', 'SCHEDULED', 'PLACED', 'ACCEPTED', 'PREPARED', 'OUT_OF_STOCK');
ALTER TABLE "Item" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "status" TYPE "ITEM_STATUS_new" USING ("status"::text::"ITEM_STATUS_new");
ALTER TYPE "ITEM_STATUS" RENAME TO "ITEM_STATUS_old";
ALTER TYPE "ITEM_STATUS_new" RENAME TO "ITEM_STATUS";
DROP TYPE "ITEM_STATUS_old";
ALTER TABLE "Item" ALTER COLUMN "status" SET DEFAULT 'PLACED';
COMMIT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "CATEGORY_TYPE" NOT NULL DEFAULT 'DEFAULT';

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "tokenId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "kitchenCategoryId" TEXT;

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "printed" BOOLEAN NOT NULL DEFAULT false,
    "printedAt" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "orderId" TEXT,
    "storeId" TEXT NOT NULL,
    "createdId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_shortId_key" ON "Token"("shortId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_kitchenCategoryId_fkey" FOREIGN KEY ("kitchenCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_updatedId_fkey" FOREIGN KEY ("updatedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
