import { ApiProperty } from '@nestjs/swagger';

export class FolderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  folderName: string;

  @ApiProperty()
  ownerId: number;
  @ApiProperty()
  parentId: number;
}
