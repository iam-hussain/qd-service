/*
  Warnings:

  - You are about to drop the column `billVersion` on the `Item` table. All the data in the column will be lost.
  - The `table` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[storeId,shortId,version]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortId,storeId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_billId_billVersion_fkey";

-- DropIndex
DROP INDEX "Bill_orderId_version_key";

-- DropIndex
DROP INDEX "Bill_shortId_version_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "billVersion";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "table",
ADD COLUMN     "table" JSONB NOT NULL DEFAULT '{}',
ALTER COLUMN "extra" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Bill_storeId_shortId_version_key" ON "Bill"("storeId", "shortId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Order_shortId_storeId_key" ON "Order"("shortId", "storeId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
