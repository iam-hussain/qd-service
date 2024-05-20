-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "kitchenCategoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_kitchenCategoryId_fkey" FOREIGN KEY ("kitchenCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
