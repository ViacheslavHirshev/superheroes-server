import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddedSuperheroAndImageTables1770474147269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'superhero',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nickname',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'real_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'origin_description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'superpowers',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'catch_phrase',
            type: 'text',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'image',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'superhero_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'image',
      new TableForeignKey({
        columnNames: ['superhero_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'superhero',
        onDelete: 'NO ACTION',
        name: 'FK_image_superhero',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('image', 'FK_image_superhero');
    await queryRunner.dropTable('image');
    await queryRunner.dropTable('superhero');
  }
}
