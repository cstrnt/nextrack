/*
  Warnings:

  - You are about to drop the column `votes` on the `SongWish` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SongWish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "playedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitterIpHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SongWish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SongWish" ("createdAt", "id", "link", "playedAt", "submitterIpHash", "title", "userId") SELECT "createdAt", "id", "link", "playedAt", "submitterIpHash", "title", "userId" FROM "SongWish";
DROP TABLE "SongWish";
ALTER TABLE "new_SongWish" RENAME TO "SongWish";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
