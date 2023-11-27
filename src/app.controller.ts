import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { FolderDto } from 'src/entities/FolderDto';
import { Folder } from '@prisma/client';
import { get } from 'https';
import { assigndto } from 'src/entities/assignfolderdto';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('folder')
export class AppController {
  constructor(private readonly folderservice: AppService) {}
  // @UseGuards(AuthGuard)
  @MessagePattern({ cmd: 'createnonnativefolder' })
  @ApiCreatedResponse({ type: FolderDto })
  creatennonnativefolder(messagePayload: any) {
    const ownerid = messagePayload.ownerid;
    const parentid = messagePayload.parentid;
    const folder = messagePayload.folder;
    const ownerida = Number(ownerid);

    const parentida = parentid.toString();

    return this.folderservice.createnonnativefolder(
      folder,
      ownerida,
      parentida,
    );
  }
  @MessagePattern({ cmd: 'addnativefolder' })
  @ApiCreatedResponse({ type: FolderDto })
  createnativefolder(messagePayload: any) {
    const ownerid = messagePayload.ownerid;
    const folder = messagePayload.folder;
    const ownerida = Number(ownerid);

    return this.folderservice.createnativefolder(folder, ownerida);
  }
  @MessagePattern({ cmd: 'affectfoldertouser' })
  @ApiCreatedResponse({ type: FolderDto })
  affectfoldertouser(messagePayload: any) {
    const iduser = messagePayload.result;
    const idfolder = messagePayload.idfolder;
    const folder = messagePayload.folder;
    const emailsender=messagePayload.emailsender;
    const idusera = Number(iduser);

    const idfoldera = idfolder.toString();
    return this.folderservice.affectfoldertouser(

      idusera,
      idfoldera,
      folder.right,
      emailsender,
      folder.email,
    );
  }
  @MessagePattern({ cmd: 'editfoldername' })
  @ApiCreatedResponse({ type: FolderDto })
  editfolder(messagePayload: any) {
    const idfolder = messagePayload.idfolder;
    const folder = messagePayload.folder;
    const idfoldera = idfolder.toString();

    return this.folderservice.Edit(idfoldera, folder);
  }
  @MessagePattern({ cmd: 'getownednativefolders' })
  @ApiCreatedResponse({ type: FolderDto })
  getnativeownedfolders(idusera: number) {
    const iduser = Number(idusera);

    return this.folderservice.Getownednativefolders(iduser);
  }
  @MessagePattern({ cmd: 'getsharedfolders' })
  @ApiCreatedResponse({ type: FolderDto })
  getsharedfolders(idusera: number) {
    const iduser = Number(idusera);

    return this.folderservice.Getsharedfolders(iduser);
  }
  @MessagePattern({ cmd: 'getsubfolders' })
  @ApiCreatedResponse({ type: FolderDto })
  getsubfolders(idfoldera: number) {
    const idfolder = idfoldera.toString();

    return this.folderservice.GetsubFolders(idfolder);
  }
  @MessagePattern({ cmd: 'safedeletefolder' })
  @ApiCreatedResponse({ type: FolderDto })
  safedeletefolder(idfoldera: number) {
    const idfolder = idfoldera.toString();

    return this.folderservice.Safedeletefolde(idfolder);
  }
  @MessagePattern({ cmd: 'restorefolder' })
  @ApiCreatedResponse({ type: FolderDto })
  restorfolder(idfoldera: number) {
    const idfolder = idfoldera.toString();

    return this.folderservice.restorefolder(idfolder);
  }

  @MessagePattern({ cmd: 'getowneddeletedfolders' })
  @ApiCreatedResponse({ type: FolderDto })
  getowneddeletedfolders(udusera: number) {
    const iduser = Number(udusera);

    return this.folderservice.Getownedeletedfolders(iduser);
  }
  @MessagePattern({ cmd: 'copyfolder' })
  @ApiCreatedResponse({ type: FolderDto })
  copyfolder(messagePayload: any) {
    const idfolder = messagePayload.idfolder;
    const idparentfolder = messagePayload.idparentfolder;
    const iduser = messagePayload.iduser;

    const idfoldera = idfolder.toString();
    const idparnetfoldera = idparentfolder.toString();
    const idusera = Number(iduser);

    return this.folderservice.copyfolder(idfoldera, idparnetfoldera, idusera);
  }
  @MessagePattern({ cmd: 'cutfolder' })
  @ApiCreatedResponse({ type: FolderDto })
  cutfolder(messagePayload: any) {
    const idfolder = messagePayload.idfolder;
    const idparentfolder = messagePayload.idparentfolder;
    const idfoldera = idfolder.toString();
    const idparnetfoldera = idparentfolder.toString();
    return this.folderservice.cutfolder(idfoldera, idparnetfoldera);
  }
}
