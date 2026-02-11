-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('NOTICE', 'EVENT');

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'NOTICE',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsPost_createdAt_idx" ON "NewsPost"("createdAt");

-- CreateIndex
CREATE INDEX "NewsPost_category_idx" ON "NewsPost"("category");

-- CreateIndex
CREATE INDEX "NewsPost_eventDate_idx" ON "NewsPost"("eventDate");
