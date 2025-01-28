/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `deliveryAreas` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `menu` on the `Restaurant` table. All the data in the column will be lost.
  - The `status` column on the `Restaurant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `preparationTime` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "RestaurantCategory" AS ENUM ('CASUAL_DINING', 'FINE_DINING', 'FAST_FOOD', 'CAFE', 'STREET_FOOD', 'BUFFET', 'FAMILY_STYLE', 'FOOD_TRUCK', 'DELIVERY_ONLY');

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "customization" JSONB,
ADD COLUMN     "preparationTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "actualDeliveryTime" TIMESTAMP(3),
ADD COLUMN     "estimatedDeliveryTime" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "deliveryAreas",
DROP COLUMN "menu",
ADD COLUMN     "categories" "RestaurantCategory"[],
DROP COLUMN "status",
ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "baseDeliveryFee" DOUBLE PRECISION NOT NULL,
    "minimumOrder" DOUBLE PRECISION NOT NULL,
    "boundaries" JSONB NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliveryZone_restaurantId_idx" ON "DeliveryZone"("restaurantId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Restaurant_status_idx" ON "Restaurant"("status");

-- AddForeignKey
ALTER TABLE "DeliveryZone" ADD CONSTRAINT "DeliveryZone_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
