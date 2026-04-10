import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamionService } from './camion.service';
import { CamionController } from './camion.controller';
import { Camion } from './entities/camion.entity';
import { Driver } from '../driver/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Camion, Driver])],
  controllers: [CamionController],
  providers: [CamionService],
  exports: [CamionService],
})
export class CamionModule {}