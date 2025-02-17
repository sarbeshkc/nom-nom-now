/*
  Warnings:

  - Made the column `imageUrl` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "allergens" TEXT[],
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuredInId" TEXT,
ADD COLUMN     "orderCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "popularInId" TEXT,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "review" TEXT,
ADD COLUMN     "reviewDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_featuredInId_fkey" FOREIGN KEY ("featuredInId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_popularInId_fkey" FOREIGN KEY ("popularInId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
