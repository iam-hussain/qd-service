/*
  Warnings:

  - You are about to drop the column `featureFlag` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "featureFlag",
ADD COLUMN     "featureFlags" JSONB NOT NULL DEFAULT '{}';
