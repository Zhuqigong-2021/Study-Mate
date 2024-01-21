/*
  Warnings:

  - You are about to drop the `choice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `choice` DROP FOREIGN KEY `Choice_questionId_fkey`;

-- DropTable
DROP TABLE `choice`;
