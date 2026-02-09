import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from 'src/dto/queryPagination.dto';

export class GetQueryDto extends QueryPaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}
