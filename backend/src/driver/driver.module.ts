import { Module } from '@nestjs/common';
import { DriversController } from './driver.controller';
import { DriversService } from './driver.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { Camion } from 'src/camion/entities/camion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Driver,Camion ])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriverModule {}
