import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversController } from './driver.controller';
import { DriversService } from './driver.service';
import { Driver } from './entities/driver.entity';
import { Camion } from '../camion/entities/camion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Driver, Camion])],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriverModule {}