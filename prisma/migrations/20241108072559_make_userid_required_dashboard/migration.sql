/*
  Warnings:

  - Made the column `userId` on table `Dashboard` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Dashboard" DROP CONSTRAINT "Dashboard_userId_fkey";

-- AlterTable
ALTER TABLE "Dashboard" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
