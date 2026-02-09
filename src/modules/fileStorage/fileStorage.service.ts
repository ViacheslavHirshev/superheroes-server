import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import path from 'path';
import { FILE_UPLOADS_DIR } from 'src/constants/constants';
import crypto from 'crypto';

@Injectable()
export class FileStorageService {
  private readonly imagesDir: string = path.join(
    process.cwd(),
    FILE_UPLOADS_DIR,
  );

  constructor() {}

  public async save(file: Express.Multer.File) {
    const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const filePath = path.join(this.imagesDir, fileName);

    await this.makeDirIfNotExists();

    await fs.writeFile(filePath, file.buffer);
    return `/${FILE_UPLOADS_DIR}/${fileName}`;
  }

  public async saveMultiple(files: Express.Multer.File[]) {
    const fileNames = await Promise.all(files.map((file) => this.save(file)));

    return fileNames;
  }

  public async delete(url: string) {
    const fileName = url.replace(`/${FILE_UPLOADS_DIR}/`, '');
    const filePath = path.join(this.imagesDir, fileName);

    await fs.unlink(filePath);
  }

  private async makeDirIfNotExists() {
    try {
      await fs.access(this.imagesDir);
    } catch (error) {
      await fs.mkdir(this.imagesDir);
    }
  }
}
