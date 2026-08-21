import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder().build();
export const documentFactory = (app: INestApplication<any>) =>
  SwaggerModule.createDocument(app, config);
