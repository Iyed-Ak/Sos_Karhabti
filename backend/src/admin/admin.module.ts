import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { Client } from 'src/client/entities/client.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Camion } from 'src/camion/entities/camion.entity';
import { MissionSOS } from 'src/mission-sos/entities/mission-so.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Client, Driver, Camion, MissionSOS, Vehicule]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}