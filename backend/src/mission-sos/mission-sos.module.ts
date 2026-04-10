import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionSOSService } from './mission-sos.service';
import { MissionSOSController } from './mission-sos.controller';
import { MissionSOS } from './entities/mission-so.entity';
import { Client } from '../client/entities/client.entity';
import { Vehicule } from '../vehicule/entities/vehicule.entity';
import { Camion } from '../camion/entities/camion.entity';
import { Driver } from '../driver/entities/driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MissionSOS, Client, Vehicule, Camion, Driver]),
  ],
  controllers: [MissionSOSController],
  providers: [MissionSOSService],
  exports: [MissionSOSService],
})
export class MissionSOSModule {}