import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSuperheroDto } from './createSuperhero.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateSuperheroDto extends PartialType(CreateSuperheroDto) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  deleteAvatar?: boolean;
}
