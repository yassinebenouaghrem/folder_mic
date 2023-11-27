import { ApiProperty } from '@nestjs/swagger';

export class assigndto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  right?: string;
}
