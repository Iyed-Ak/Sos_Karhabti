import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AffecterMissionDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  camionId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  chauffeurId: number;
}