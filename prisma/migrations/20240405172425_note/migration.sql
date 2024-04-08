/*
  Warnings:

  - You are about to drop the column `notes` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "notes",
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "notes",
ADD COLUMN     "note" TEXT;
