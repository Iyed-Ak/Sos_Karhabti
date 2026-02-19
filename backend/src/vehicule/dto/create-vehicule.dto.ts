import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OneToMany } from 'typeorm';
import { Entretien } from 'src/entretien/entities/entretien.entity';

export enum TypeCarburant {
  ESSENCE = 'essence',
  DIESEL = 'diesel',
  ELECTRIQUE = 'electrique',
  HYBRIDE = 'hybride',
}

export class CreateVehiculeDto {

  @IsString()
  marque: string;

  @IsString()
  modele: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  annee: number;

  @IsString()
  plaqueImmatriculation: string;

  @IsString()
  @IsOptional()
  vin?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  kilometrageActuel: number;

  @IsEnum(TypeCarburant)
  typeCarburant: TypeCarburant;

  @IsDateString()
  @IsOptional()
  dateAcquisition?: string;

  @IsString()
  @IsOptional()
  couleur?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @Type(() => Number)
  @IsNumber()
  userId: number;

 
}
