/*
  Warnings:

  - You are about to drop the column `prepared` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "prepared",
ADD COLUMN     "preparedAt" TIMESTAMP(3);
