import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AdminRole } from '../entities/admin.entity';

export class CreateAdminDto extends CreateUserDto {
  @IsEnum(AdminRole)
  @IsOptional()
  adminRole?: AdminRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}