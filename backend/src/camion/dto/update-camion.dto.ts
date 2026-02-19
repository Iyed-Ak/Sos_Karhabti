import { PartialType } from '@nestjs/mapped-types';
import { CreateCamionDto } from './create-camion.dto';

export class UpdateCamionDto extends PartialType(CreateCamionDto) {}
