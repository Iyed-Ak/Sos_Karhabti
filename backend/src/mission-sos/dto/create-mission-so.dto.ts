import { IsEnum, IsNumber, IsString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TypePanne } from '../entities/mission-so.entity';

export class CreateMissionSOSDto {
  // Le nom et téléphone du client seront récupérés automatiquement depuis le compte connecté
  // Pas besoin de les inclure dans le DTO, ils seront ajoutés dans le service

  // Localisation GPS (partagée automatiquement)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  latitudeGPS?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  longitudeGPS?: number;

  // OU adresse manuelle (si le client ne partage pas GPS)
  @IsString()
  @IsOptional()
  adresseManuelle?: string;

  // Type de panne (obligatoire)
  @IsEnum(TypePanne)
  typePanne: TypePanne;

  // Description de la panne (optionnelle)
  @IsString()
  @IsOptional()
  descriptionPanne?: string;

  // ID du véhicule concerné (sera ajouté quand la relation sera créée)
  // @Type(() => Number)
  // @IsNumber()
  // @IsOptional()
  // vehiculeId?: number;
}