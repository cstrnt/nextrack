/*
  Warnings:

  - A unique constraint covering the columns `[songWishId,voterIpHash]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_songWishId_voterIpHash_key" ON "Vote"("songWishId", "voterIpHash");
