/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'RESTAURANT_OWNER');

-- DropIndex
DROP INDEX "User_verificationToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "provider",
DROP COLUMN "providerId",
DROP COLUMN "verificationToken",
ALTER COLUMN "password" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "PasswordReset";

-- DropEnum
DROP TYPE "AuthProvider";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cuisine" TEXT[],
    "openingHours" JSONB NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);
