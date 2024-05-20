-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "kitchenCategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_kitchenCategoryId_fkey" FOREIGN KEY ("kitchenCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
