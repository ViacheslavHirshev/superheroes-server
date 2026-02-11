import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  SWAGGER_IMAGE_DELETE_BODY,
  SWAGGER_IMAGE_POST_BODY,
} from 'src/constants/constants';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Delete(':id')
  @ApiBody(SWAGGER_IMAGE_DELETE_BODY)
  public async delete(@Param('id', ParseIntPipe) imageId: number) {
    return this.imageService.deleteImage(imageId);
  }

  @Post(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody(SWAGGER_IMAGE_POST_BODY)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
        maxCount: 10,
      },
    ]),
  )
  public async create(
    @Param('id', ParseIntPipe) superheroId: number,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
    },
  ) {
    return this.imageService.createImages(superheroId, files.images);
  }
}
