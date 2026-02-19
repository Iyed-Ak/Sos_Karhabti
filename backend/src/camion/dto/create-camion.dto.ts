import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCamionDto {

  @IsString()
  @IsNotEmpty()
  immatriculation: string;

  @IsString()
  @IsNotEmpty()
  marque: string;

  @IsString()
  @IsNotEmpty()
  modele: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capaciteRemorquage: number;

  @IsString()
  @IsOptional()
  planningHoraire?: string;

  @IsBoolean()
  @IsOptional()
  estDisponible?: boolean;

  @IsString()
  @IsOptional()
  image?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  kilometrageActuel?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  annee?: number;

  @IsString()
  @IsOptional()
  couleur?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  currentDriverId?: number; // ID du chauffeur assigné à ce camion
}