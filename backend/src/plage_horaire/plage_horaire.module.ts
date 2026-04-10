import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlageHoraireService } from './plage_horaire.service';
import { PlageHoraireController } from './plage_horaire.controller';
import { PlageHoraire } from './entities/plage_horaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlageHoraire])],
  controllers: [PlageHoraireController],
  providers: [PlageHoraireService],
  exports: [PlageHoraireService],
})
export class PlageHoraireModule {}