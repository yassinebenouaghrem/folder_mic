-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "folderName" TEXT NOT NULL,
    "parentFolderId" INTEGER,
    "userId" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnFolders" (
    "id" SERIAL NOT NULL,
    "folderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "right" TEXT NOT NULL,

    CONSTRAINT "UsersOnFolders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
