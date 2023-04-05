/*
  Warnings:

  - You are about to drop the `tablegroupmembers` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `tablegroupmembers` DROP FOREIGN KEY `TableGroupMembers_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `tablegroupmembers` DROP FOREIGN KEY `TableGroupMembers_userId_fkey`;

-- AlterTable
ALTER TABLE `reminder` MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `color` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `tablegroupmembers`;
