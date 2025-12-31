/*
  Warnings:

  - You are about to drop the `summaries` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `summaries` DROP FOREIGN KEY `summaries_productId_fkey`;

-- AlterTable
ALTER TABLE `products` MODIFY `description` TEXT NOT NULL;

-- DropTable
DROP TABLE `summaries`;

-- CreateTable
CREATE TABLE `Summary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Summary_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Summary` ADD CONSTRAINT `Summary_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
