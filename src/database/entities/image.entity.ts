import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SuperheroEntity } from './superhero.entity';

export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  url: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @ManyToOne(() => SuperheroEntity, (superhero) => superhero.images)
  @JoinColumn({ name: 'superhero_id' })
  superhero: SuperheroEntity;
  @Column({
    type: 'int',
    nullable: false,
  })
  superhero_id: number;
}
