import { Module } from '@nestjs/common';
import { CamionService } from './camion.service';
import { CamionController } from './camion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Camion } from './entities/camion.entity';
import { Driver } from 'src/driver/entities/driver.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Camion]) ],
  controllers: [CamionController],
  providers: [CamionService],
})
export class CamionModule {}
