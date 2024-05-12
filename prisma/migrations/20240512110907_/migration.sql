/*
  Warnings:

  - The values [SHEDULED] on the enum `ITEM_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ITEM_STATUS_new" AS ENUM ('DRAFT', 'SCHEDULED', 'PLACED', 'ACCEPTED', 'PROGRESS', 'PREPARED');
ALTER TABLE "Item" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "status" TYPE "ITEM_STATUS_new" USING ("status"::text::"ITEM_STATUS_new");
ALTER TYPE "ITEM_STATUS" RENAME TO "ITEM_STATUS_old";
ALTER TYPE "ITEM_STATUS_new" RENAME TO "ITEM_STATUS";
DROP TYPE "ITEM_STATUS_old";
ALTER TABLE "Item" ALTER COLUMN "status" SET DEFAULT 'PLACED';
COMMIT;
