/*
  Warnings:

  - You are about to drop the column `data` on the `Board` table. All the data in the column will be lost.
  - Added the required column `height` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_dashboardId_fkey";

-- DropForeignKey
ALTER TABLE "Dashboard" DROP CONSTRAINT "Dashboard_userId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "data",
ADD COLUMN     "currentDataId" TEXT,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Dashboard" ALTER COLUMN "isDefault" SET DEFAULT false;

-- CreateTable
CREATE TABLE "sampleData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "sampleData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
