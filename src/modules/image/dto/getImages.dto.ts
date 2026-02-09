import { GetImageDto } from './getImage.dto';

export class GetImagesDto {
  imagesCount: number;
  maxAllowed: number;
  images: GetImageDto[];
}
