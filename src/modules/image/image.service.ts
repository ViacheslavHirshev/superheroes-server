import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MAX_IMAGES_ALLOWED } from 'src/constants/constants';
import { Image } from 'src/database/entities/image.entity';
import { Repository } from 'typeorm';
import { GetImagesDto } from './dto/getImages.dto';
import { FileStorageService } from '../fileStorage/fileStorage.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    private fileStorageService: FileStorageService,
  ) {}

  public async createImages(
    id: number,
    images: Express.Multer.File[],
  ): Promise<GetImagesDto> {
    try {
      const imagesCount = await this.imageRepository.count({
        where: { superhero_id: id },
      });

      if (imagesCount + images.length > MAX_IMAGES_ALLOWED)
        throw new BadRequestException(
          `You can upload only ${MAX_IMAGES_ALLOWED - imagesCount} more images`,
        );

      const imgUrls = await this.fileStorageService.saveMultiple(images);

      const newImages = await Promise.all(
        imgUrls.map((url) => {
          const image = this.imageRepository.create({
            url,
            superhero_id: id,
          });
          return this.imageRepository.save(image);
        }),
      );

      return {
        images: newImages.map((img) => ({ id: img.id, url: img.url })),
        imagesCount: imagesCount + newImages.length,
        maxAllowed: MAX_IMAGES_ALLOWED,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteImage(imageId: number) {
    try {
      const image = await this.imageRepository.findOneBy({ id: imageId });
      if (!image) throw new NotFoundException('Image not found');

      await this.fileStorageService.delete(image.url);
      await this.imageRepository.delete({ id: imageId });

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
