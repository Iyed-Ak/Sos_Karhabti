import { IsString, IsNotEmpty, IsEmail, IsEnum, IsDate } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { DriverStatus } from '../entities/driver.entity';

export class CreateDriverDto extends CreateUserDto {
    @IsEnum(DriverStatus)
    statusDriver: DriverStatus;


    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}