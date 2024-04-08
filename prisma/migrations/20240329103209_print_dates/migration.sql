/*
  Warnings:

  - The values [READY,COMPLETED] on the enum `ITEM_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `billedAt` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `paidBy` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `startAfter` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId,version]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ITEM_STATUS_new" AS ENUM ('SHEDULED', 'PLACED', 'ACCEPTED', 'PROGRESS', 'PREPARED');
ALTER TABLE "Item" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "status" TYPE "ITEM_STATUS_new" USING ("status"::text::"ITEM_STATUS_new");
ALTER TYPE "ITEM_STATUS" RENAME TO "ITEM_STATUS_old";
ALTER TYPE "ITEM_STATUS_new" RENAME TO "ITEM_STATUS";
DROP TYPE "ITEM_STATUS_old";
ALTER TABLE "Item" ALTER COLUMN "status" SET DEFAULT 'PLACED';
COMMIT;

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "billedAt",
DROP COLUMN "paidBy",
ADD COLUMN     "paidWith" "BILL_PAID_BY" NOT NULL DEFAULT 'WALLET';

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "startAfter",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "placeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "placedAt" TIMESTAMP(3),
ADD COLUMN     "prepared" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "printDeck" JSONB[],
ADD COLUMN     "printFooter" JSONB[],
ADD COLUMN     "printHead" JSONB[];

-- CreateIndex
CREATE UNIQUE INDEX "Bill_orderId_version_key" ON "Bill"("orderId", "version");
