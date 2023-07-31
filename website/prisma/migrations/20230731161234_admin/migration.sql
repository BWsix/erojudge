/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Testcase" ADD COLUMN     "hide_output" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User',
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;
