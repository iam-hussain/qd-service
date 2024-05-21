/*
  Warnings:

  - A unique constraint covering the columns `[shortId,storeId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Token_orderId_shortId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Token_shortId_storeId_key" ON "Token"("shortId", "storeId");
