import { IsEnum, IsDateString, IsNumber, IsString, IsBoolean, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeEntretien } from '../entities/entretien.entity';

export class CreateEntretienDto {

  @IsEnum(TypeEntretien)
  type: TypeEntretien;

  @IsDateString()
  datePrevue: string;

  @IsDateString()
  @IsOptional()
  dateRealisee?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  cout?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  kilometragePrevu?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  kilometrageRealise?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  estRealise?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  // Sera ajouté plus tard quand la relation avec Vehicule sera créée
   @Type(() => Number)
   @IsNumber()
  vehiculeId: number;
}