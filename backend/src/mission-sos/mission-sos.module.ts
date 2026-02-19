import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionSOSService } from './mission-sos.service';
import { MissionSOSController } from './mission-sos.controller';
import { MissionSOS } from './entities/mission-so.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissionSOS])],
  controllers: [MissionSOSController],
  providers: [MissionSOSService],
  exports: [MissionSOSService],
})
export class MissionSOSModule {}