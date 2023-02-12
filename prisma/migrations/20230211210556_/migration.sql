/*
  Warnings:

  - You are about to drop the `SongWish` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SongWish" DROP CONSTRAINT "SongWish_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_songWishId_fkey";

-- DropTable
DROP TABLE "SongWish";

-- CreateTable
CREATE TABLE "SongRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "playedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitterIpHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SongRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SongRequest" ADD CONSTRAINT "SongRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_songWishId_fkey" FOREIGN KEY ("songWishId") REFERENCES "SongRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
