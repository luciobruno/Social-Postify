/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Publication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
