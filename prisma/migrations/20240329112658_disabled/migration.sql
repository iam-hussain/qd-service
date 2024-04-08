-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "disabledAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("shortId") ON DELETE SET NULL ON UPDATE CASCADE;
