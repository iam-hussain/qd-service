/*
  Warnings:

  - You are about to drop the column `billId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `kitchenCategoryId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `placeAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `preparedAt` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `printed` on the `Token` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_billId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_kitchenCategoryId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "billId",
DROP COLUMN "kitchenCategoryId",
DROP COLUMN "placeAt",
DROP COLUMN "preparedAt",
DROP COLUMN "status",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "tz" TEXT NOT NULL DEFAULT 'Asia/Kolkata';

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "completed",
DROP COLUMN "printed";

-- DropEnum
DROP TYPE "ITEM_STATUS";

-- CreateTable
CREATE TABLE "BilledItem" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "note" TEXT,
    "type" "PRODUCT_TYPE" NOT NULL DEFAULT 'NON_VEG',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "itemId" TEXT NOT NULL,
    "createdId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billId" TEXT NOT NULL,

    CONSTRAINT "BilledItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BilledItem" ADD CONSTRAINT "BilledItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BilledItem" ADD CONSTRAINT "BilledItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BilledItem" ADD CONSTRAINT "BilledItem_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BilledItem" ADD CONSTRAINT "BilledItem_updatedId_fkey" FOREIGN KEY ("updatedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
