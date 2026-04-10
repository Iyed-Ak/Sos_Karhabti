import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeNotification } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsEnum(TypeNotification)
  type: TypeNotification;

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsString()
  @IsOptional()
  referenceType?: string;

  @Type(() => Number)
  @IsNumber()
  userId: number;
}