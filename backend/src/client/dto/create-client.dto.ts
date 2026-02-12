import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { Column, CreateDateColumn } from "typeorm";

export class CreateClientDto extends CreateUserDto{
    @IsString()
    @IsNotEmpty()
    status: string;
    @IsDate()

    createdAt: Date;

@IsNumber()   

 totalRequests: number;

@IsDate()
        updatedAt: Date;

@IsNumber()   
    nombreVehicules: number;

@IsNumber()   
    nombreMissionsSOS: number;
}
