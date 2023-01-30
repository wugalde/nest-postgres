import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {

  const logger = new Logger('main:bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1/')
  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true, 
      })
  );


  const config = new DocumentBuilder()
                .setTitle('Telo rest full')
                .setDescription('Practi en nest para realizar un api')
                .setVersion('1.0')
                .addTag('teslo')
                .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT);

  logger.log(`Aplicacion corriendo en el puerto ${process.env.PORT}`)
}
bootstrap();
