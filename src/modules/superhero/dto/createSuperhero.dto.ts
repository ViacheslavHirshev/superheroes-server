import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuperheroDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  realName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  originDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  superpowers: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  catchPhrase: string;
}
