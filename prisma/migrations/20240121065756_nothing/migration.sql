/*
  Warnings:

  - You are about to drop the `choice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `choice` DROP FOREIGN KEY `Choice_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `Question_noteId_fkey`;

-- DropTable
DROP TABLE `choice`;

-- DropTable
DROP TABLE `question`;
