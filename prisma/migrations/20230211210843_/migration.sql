/*
  Warnings:

  - You are about to drop the column `isAcceptingWishes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `songWishId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[songRequestId,voterIpHash]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `songRequestId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_songWishId_fkey";

-- DropIndex
DROP INDEX "Vote_songWishId_voterIpHash_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAcceptingWishes",
ADD COLUMN     "isAcceptingRequests" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "songWishId",
ADD COLUMN     "songRequestId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_songRequestId_voterIpHash_key" ON "Vote"("songRequestId", "voterIpHash");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "SongRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
