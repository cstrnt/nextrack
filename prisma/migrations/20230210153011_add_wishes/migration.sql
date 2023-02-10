-- CreateTable
CREATE TABLE "SongWish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "playedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitterIpHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SongWish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlockList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BlockList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockList_ipHash_key" ON "BlockList"("ipHash");
