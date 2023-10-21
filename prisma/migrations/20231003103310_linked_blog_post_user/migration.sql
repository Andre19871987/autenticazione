-- AlterTable
ALTER TABLE `blogpost` ADD COLUMN `authorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
