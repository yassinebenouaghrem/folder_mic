/*
  Warnings:

  - The primary key for the `Folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UsersOnFolders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `right` on table `UsersOnFolders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parentFolderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Folder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Folder_id_seq";

-- AlterTable
ALTER TABLE "UsersOnFolders" DROP CONSTRAINT "UsersOnFolders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "folderId" SET DATA TYPE TEXT,
ALTER COLUMN "right" SET NOT NULL,
ADD CONSTRAINT "UsersOnFolders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UsersOnFolders_id_seq";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
