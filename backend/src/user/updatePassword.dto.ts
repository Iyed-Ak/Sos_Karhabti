import { IsString } from "class-validator";
export class updatePasswordDto {
    @IsString()
    oldPassword: string ;
    @IsString()
    newPassword: string ;
}