import { GetImageDto } from 'src/modules/image/dto/getImage.dto';

export class GetSuperheroDto {
  id: number;
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string;
  catchPhrase: string;
  avatarUrl: string | null;
  images: GetImageDto[];
}
