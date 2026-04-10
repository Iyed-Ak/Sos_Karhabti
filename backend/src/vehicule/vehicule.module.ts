import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { Vehicule } from './entities/vehicule.entity';
import { Client } from '../client/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicule, Client])],
  controllers: [VehiculeController],
  providers: [VehiculeService],
  exports: [VehiculeService],
})
export class VehiculeModule {}