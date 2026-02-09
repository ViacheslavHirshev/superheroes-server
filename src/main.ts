import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_METHODS, FILE_UPLOADS_DIR } from './constants/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: CORS_METHODS.join(','),
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useStaticAssets(join(process.cwd(), FILE_UPLOADS_DIR), {
    prefix: `/${FILE_UPLOADS_DIR}/`,
  });

  const config = new DocumentBuilder()
    .setTitle('Superheroes')
    .setDescription('Superheroes API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
