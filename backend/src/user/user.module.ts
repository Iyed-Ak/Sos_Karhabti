import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Driver } from 'src/driver/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Driver])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
