import { IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}