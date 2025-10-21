import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { IncorrectValuesException } from './exceptions/IncorrectValuesException';
import { mapperClassValidationErrorToAppException } from './utils/mapperValidation';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors: ValidationError[]) {
        throw new IncorrectValuesException({
          fields: mapperClassValidationErrorToAppException(errors),
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Pagemento Docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3333);
}

bootstrap();
