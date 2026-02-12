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
 await app.listen(process.env.PORT ?? 3000);;
}
bootstrap();
