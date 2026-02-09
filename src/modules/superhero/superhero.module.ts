import { Module } from '@nestjs/common';
import { SuperheroController } from './superhero.controller';
import { SuperheroService } from './superhero.service';
import { FileStorageModule } from '../fileStorage/fileStorage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Superhero } from 'src/database/entities/superhero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Superhero]), FileStorageModule],
  controllers: [SuperheroController],
  providers: [SuperheroService],
})
export class SuperheroModule {}
