import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { documentFactory } from 'configs/swagger.config';
import { PrismaExceptionFilter } from 'configs/prismaError.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
 const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // SERVER SETTINGS
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // SWAGGER
  SwaggerModule.setup('docs', app, documentFactory(app));

  await app.listen(process.env.PORT);
}
bootstrap();
