import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/database/entities/image.entity';
import { FileStorageModule } from '../fileStorage/fileStorage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), FileStorageModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
