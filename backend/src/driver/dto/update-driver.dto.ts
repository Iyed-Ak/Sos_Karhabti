import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { DriverStatus } from '../entities/driver.entity';

export class UpdateDriverDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEnum(DriverStatus)
    @IsOptional()
    status?: DriverStatus;
}

export class UpdateDriverStatusDto {
    @IsEnum(DriverStatus)
    @IsNotEmpty()
    status: DriverStatus;
}