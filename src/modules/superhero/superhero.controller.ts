import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { GetQueryDto } from './dto/getQuery.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateSuperheroDto } from './dto/createSuperhero.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  SWAGGER_SUPERHERO_PATCH_BODY,
  SWAGGER_SUPERHEROES_POST_BODY,
} from 'src/constants/constants';
import { UpdateSuperheroDto } from './dto/updateSuperhero.dto';

@Controller('superhero')
export class SuperheroController {
  constructor(private superheroService: SuperheroService) {}

  @Get()
  public async getAll(@Query() query: GetQueryDto) {
    return this.superheroService.getAllSuperheroes(query);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody(SWAGGER_SUPERHEROES_POST_BODY)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  public async create(
    @Body() dto: CreateSuperheroDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.superheroService.createSuperhero(
      dto,
      files.avatar?.[0],
      files.images ?? [],
    );
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody(SWAGGER_SUPERHERO_PATCH_BODY)
  @UseInterceptors(FileInterceptor('avatar'))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSuperheroDto,
    @UploadedFile()
    avatar?: Express.Multer.File,
  ) {
    return this.superheroService.updateSuperheroPartialy(id, dto, avatar);
  }

  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    return this.superheroService.deleteSuperhero(id);
  }

  @Get(':id')
  public async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.superheroService.getSuperheroById(id);
  }
}
