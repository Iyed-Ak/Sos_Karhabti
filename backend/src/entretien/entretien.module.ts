import { Module } from '@nestjs/common';
import { EntretienService } from './entretien.service';
import { EntretienController } from './entretien.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { Entretien } from './entities/entretien.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Entretien])],
  controllers: [EntretienController],
  providers: [EntretienService],
})
export class EntretienModule {}
