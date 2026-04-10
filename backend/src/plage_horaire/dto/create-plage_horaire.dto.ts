import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { JourSemaine } from '../entities/plage_horaire.entity';

export class CreatePlageHoraireDto {
  @IsEnum(JourSemaine)
  jourSemaine: JourSemaine;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'heureDebut doit être au format HH:MM (ex: 08:00)',
  })
  heureDebut: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'heureFin doit être au format HH:MM (ex: 18:00)',
  })
  heureFin: string;

  @IsBoolean()
  @IsOptional()
  estActif?: boolean;

  @Type(() => Number)
  @IsNumber()
  camionId: number;
}