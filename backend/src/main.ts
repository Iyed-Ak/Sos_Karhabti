import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
//  Activation des pipes globaux
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // retourne une erreur si champs inconnus
      transform: true,            // transforme automatiquement les types (string → number/date)
    }),
  );
app.enableCors({
    origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
