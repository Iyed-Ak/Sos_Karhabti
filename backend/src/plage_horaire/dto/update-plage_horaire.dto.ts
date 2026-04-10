import { PartialType } from '@nestjs/mapped-types';
import { CreatePlageHoraireDto } from './create-plage_horaire.dto';

export class UpdatePlageHoraireDto extends PartialType(CreatePlageHoraireDto) {}
