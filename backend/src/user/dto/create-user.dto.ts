import { IsEmail, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    refreshToken: string|null;


    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    //@Min(6)
    password: string;
    @IsString()
    @IsNotEmpty()
    phone: string;
    @IsString()
    @IsNotEmpty()
    address: string;
}
