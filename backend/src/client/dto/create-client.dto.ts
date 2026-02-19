import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateClientDto extends CreateUserDto{
    @IsString()
      @IsOptional()

    status: string;
    @IsDate()
  @IsOptional()

    createdAt: Date;

@IsNumber()   
  @IsOptional()

 totalRequests: number;

@IsDate()
  @IsOptional()

        updatedAt: Date;

@IsNumber()  
  @IsOptional()

    nombreVehicules: number;

@IsNumber()  
  @IsOptional()

    nombreMissionsSOS: number;
}
