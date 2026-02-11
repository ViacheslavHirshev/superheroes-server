import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Superhero } from 'src/database/entities/superhero.entity';
import { DataSource, Repository } from 'typeorm';
import { GetQueryDto } from './dto/getQuery.dto';
import { GetAllSuperheroesDto } from './dto/getAllSuperheroes.dto';
import { GetSuperheroDto } from './dto/getSuperhero.dto';
import { CreateSuperheroDto } from './dto/createSuperhero.dto';
import { FileStorageService } from '../fileStorage/fileStorage.service';
import { Image } from 'src/database/entities/image.entity';
import { UpdateSuperheroDto } from './dto/updateSuperhero.dto';

@Injectable()
export class SuperheroService {
  constructor(
    @InjectRepository(Superhero)
    private superheroRepo: Repository<Superhero>,
    private dataSource: DataSource,
    private fileStorageService: FileStorageService,
  ) {}

  public async getAllSuperheroes(
    query: GetQueryDto,
  ): Promise<GetAllSuperheroesDto> {
    const page = query.page ? query.page : 1;
    const limit = query.limit ? query.limit : 5;
    const nickname = query.nickname ? query.nickname : '';

    try {
      const result = await this.superheroRepo.findAndCount({
        where: {
          nickname: nickname.trim().length > 0 ? nickname : undefined,
        },
        skip: (page - 1) * limit,
        take: limit,
        order: { nickname: 'ASC' },
      });

      const superheroes = result[0].map((v) => ({
        id: v.id,
        nickname: v.nickname,
        avatarUrl: v.avatar_url,
      }));

      return {
        page,
        isFirst: page === 1,
        isLast: page * limit >= result[1],
        limit,
        totalItems: result[1],
        totalPages: result[1] < limit ? 1 : Math.ceil(result[1] / limit),
        superheroes,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getSuperheroById(id: number): Promise<GetSuperheroDto> {
    try {
      const result = await this.superheroRepo.findOne({
        where: {
          id,
        },
        relations: {
          images: true,
        },
      });

      if (!result) throw new NotFoundException("Superhero isn't found");

      const images =
        result.images.length > 0
          ? result.images.map((img) => ({ id: img.id, url: img.url }))
          : [];

      return {
        id: result.id,
        nickname: result.nickname,
        realName: result.real_name,
        originDescription: result.origin_description,
        superpowers: result.superpowers,
        catchPhrase: result.catch_phrase,
        avatarUrl: result.avatar_url ?? null,
        images,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createSuperhero(
    dto: CreateSuperheroDto,
    avatar?: Express.Multer.File,
    images?: Array<Express.Multer.File>,
  ): Promise<GetSuperheroDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let avatarUrl: string | null = null;
    let imageUrls: string[] = [];

    try {
      if (avatar) {
        avatarUrl = await this.fileStorageService.save(avatar);
      }

      const superhero = queryRunner.manager.create(Superhero, {
        nickname: dto.nickname,
        real_name: dto.realName,
        origin_description: dto.originDescription,
        superpowers: dto.superpowers,
        catch_phrase: dto.catchPhrase,
        avatar_url: avatarUrl,
      });

      await queryRunner.manager.save(superhero);

      let imageEnities: Image[] = [];
      if (images && images.length > 0) {
        imageUrls = await this.fileStorageService.saveMultiple(images);

        imageEnities = imageUrls.map((url) =>
          queryRunner.manager.create(Image, {
            url,
            superhero_id: superhero.id,
          }),
        );

        await queryRunner.manager.save(imageEnities);
      }

      await queryRunner.commitTransaction();

      return {
        id: superhero.id,
        nickname: superhero.nickname,
        realName: superhero.real_name,
        originDescription: superhero.origin_description,
        superpowers: superhero.superpowers,
        catchPhrase: superhero.catch_phrase,
        avatarUrl: superhero.avatar_url ?? null,
        images:
          imageEnities.length > 0
            ? imageEnities.map((img) => ({ id: img.id, url: img.url }))
            : [],
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (avatarUrl) await this.fileStorageService.delete(avatarUrl);
      await Promise.all(
        imageUrls.map((url) => this.fileStorageService.delete(url)),
      );

      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async updateSuperheroPartialy(
    id: number,
    dto: UpdateSuperheroDto,
    avatar?: Express.Multer.File,
  ): Promise<GetSuperheroDto> {
    try {
      const entity = await this.superheroRepo.findOne({
        where: { id },
        relations: { images: true },
      });

      if (!entity) throw new NotFoundException("Superhero isn't found");

      const {
        deleteAvatar,
        nickname,
        realName,
        originDescription,
        superpowers,
        catchPhrase,
      } = dto;

      if (avatar && deleteAvatar) {
        throw new BadRequestException(
          "You can't upload avatar and delete it at the same time",
        );
      }

      if (avatar) {
        if (entity.avatar_url) {
          await this.fileStorageService.delete(entity.avatar_url);
        }

        const avatarUrl = await this.fileStorageService.save(avatar);
        entity.avatar_url = avatarUrl;
      }

      if (deleteAvatar) {
        if (entity.avatar_url) {
          await this.fileStorageService.delete(entity.avatar_url);
          entity.avatar_url = null;
        } else {
          throw new NotFoundException("Superhero doesn't have avatar");
        }
      }

      if (nickname) entity.nickname = nickname;
      if (realName) entity.real_name = realName;
      if (originDescription) entity.origin_description = originDescription;
      if (superpowers) entity.superpowers = superpowers;
      if (catchPhrase) entity.catch_phrase = catchPhrase;

      const updated = await this.superheroRepo.save(entity);

      return {
        id: updated.id,
        nickname: updated.nickname,
        realName: updated.real_name,
        originDescription: updated.origin_description,
        superpowers: updated.superpowers,
        catchPhrase: updated.catch_phrase,
        avatarUrl: updated.avatar_url ?? null,
        images:
          entity.images.length > 0
            ? entity.images.map((img) => ({ id: img.id, url: img.url }))
            : [],
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteSuperhero(id: number): Promise<boolean> {
    try {
      const isExists = await this.superheroRepo.exists({ where: { id } });
      if (!isExists) throw new NotFoundException("Superhero isn't found");

      await this.superheroRepo.softDelete({ id });
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
