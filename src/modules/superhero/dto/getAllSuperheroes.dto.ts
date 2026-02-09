import { GetSuperheroDto } from './getSuperhero.dto';

export class GetAllSuperheroesDto {
  page: number;
  isFirst: boolean;
  isLast: boolean;
  limit: number;
  totalItems: number;
  totalPages: number;
  superheroes: Partial<GetSuperheroDto>[];
}
