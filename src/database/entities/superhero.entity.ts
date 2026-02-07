import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImageEntity } from './image.entity';

export class SuperheroEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: false })
  real_name: string;

  @Column({ type: 'text', nullable: false })
  origin_description: string;

  @Column({ type: 'text', nullable: false })
  superpowers: string;

  @Column({ type: 'text', nullable: false, unique: true })
  catch_phrase: string;

  @Column({ type: 'varchar', nullable: true })
  avatar_url?: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => ImageEntity, (image) => image.superhero)
  images: ImageEntity[];
}
