import { PartialType } from '@nestjs/mapped-types';
import { CreateMissionSOSDto } from './create-mission-so.dto';

export class UpdateMissionSoDto extends PartialType(CreateMissionSOSDto) {}
