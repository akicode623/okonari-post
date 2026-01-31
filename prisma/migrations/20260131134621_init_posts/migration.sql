/*
  Warnings:

  - The `places` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `actions` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "places",
ADD COLUMN     "places" TEXT[],
DROP COLUMN "actions",
ADD COLUMN     "actions" TEXT[];
