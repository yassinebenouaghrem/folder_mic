import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FolderDto } from 'src/entities/FolderDto';
import { Folder, UsersOnFolders } from '@prisma/client';
import { MailingService } from './externalapis/mailing/mailing.service';
import { truncate } from 'fs/promises';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private mailingservice: MailingService,
  ) {}
  async createnonnativefolder(
    folder: FolderDto,
    wonerId: number,
    parentId: string,
  ): Promise<Folder | never> {
    try {
      return this.prisma.folder.create({
        data: {
          folderName: folder.folderName,
          userId: wonerId,
          parentFolderId: parentId,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when creating the folder',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async createnativefolder(
    folder: FolderDto,
    wonerId: number,
  ): Promise<Folder | never> {
    try {
      return this.prisma.folder.create({
        data: {
          folderName: folder.folderName,
          userId: wonerId,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when creating folder.',
          error: err.message,
        },
        err.status,
      );
    }
  }

  async affectfoldertouser(
    iduser: number,
    idfolder: string,
    right: string,
    emailsender: string,
    emailreceiver: string,
  ): Promise<any | never> {
    const namefolder = await this.prisma.folder.findUnique({
      where: { id: idfolder },
      select: { folderName: true },
    });
    console.log(namefolder);
    const foldername = namefolder.folderName;
    
    this.mailingservice.sendMail(
      emailreceiver,
      'SharedFolder',
      foldername,
      emailsender,
      'sendForgetEmailTemplate',
    );

    return this.prisma.usersOnFolders.create({
      data: {
        folderId: idfolder,
        userId: iduser,
      },
    });
  }
  async Edit(id: string, folder: FolderDto): Promise<Folder | never> {
    try {
      return this.prisma.folder.update({
        where: { id: id },
        data: {
          folderName: folder.folderName,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when updating the name',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async Getownednativefolders(iduser: number): Promise<Folder[] | never> {
    try {
      return this.prisma.folder.findMany({
        where: { userId: iduser, parentFolderId: null, deleted: false },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when getting the folders',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async Getsharedfolders(iduser: number): Promise<Folder[] | never> {
    try {
      let folders: Folder[] = []; // Initialize the folders array

      let usersonfolders = await this.prisma.usersOnFolders.findMany({
        where: { userId: iduser },
        select: { folderId: true },
      });
      console.log(usersonfolders);
      for (let element of usersonfolders) {
        let listfolder = await this.prisma.folder.findUnique({
          where: { id: element.folderId },
        });
        folders.push(listfolder); // Use the spread operator to push the individual items
        console.log(folders);
      }

      return folders;
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when getting the folders.',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async GetsubFolders(idparentfolder: string): Promise<Folder[] | never> {
    try {
      return this.prisma.folder.findMany({
        where: {
          deleted: false,
          parentFolderId: idparentfolder,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when getting the folders ',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async Safedeletefolde(id: string): Promise<Folder | never> {
    try {
      return this.prisma.folder.update({
        where: { id: id },
        data: {
          deleted: true,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when safedeleting folder',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async restorefolder(id: string): Promise<Folder | never> {
    try {
      return this.prisma.folder.update({
        where: { id: id },
        data: {
          deleted: false,
        },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when restoring folder',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async Getownedeletedfolders(iduser: number): Promise<Folder[] | never> {
    try {
      return this.prisma.folder.findMany({
        where: { userId: iduser, deleted: true },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when getting the deleted folders',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async copyfolder(
    idfolder: string,
    idparnetfolder: string,
    iduser: number,
  ): Promise<Folder | never> {
    try {
      const folder = await this.prisma.folder.findUnique({
        where: { id: idfolder },
      });
      const newfolder = {
        folderName: folder.folderName,
        parentFolderId: idparnetfolder,
        userId: iduser,
        deleted: false,

        // Set the new folder ID
      };
      return this.prisma.folder.create({ data: newfolder });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when copying folder',
          error: err.message,
        },
        err.status,
      );
    }
  }
  async cutfolder(
    idfolder: string,
    idparnetfolder: string,
  ): Promise<Folder | never> {
    try {
      let idfoldera;
      if (idparnetfolder == 'qwerty123456') idfoldera = null;
      else
      idfoldera = idparnetfolder;
      return this.prisma.folder.update({
        where: { id: idfolder },
        data: { parentFolderId: idfoldera },
      });
    } catch (err) {
      throw new HttpException(
        {
          status: err.status,
          message: 'An error has occurred when cutting folder ',
          error: err.message,
        },
        err.status,
      );
    }
  }
}
