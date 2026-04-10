import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import* as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'email ${email} non trouvé`);
    }
    return user;
  }
  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  async updateRefreshToken(id: number, refreshToken: string | null) {
await this.userRepository.update(id, { refreshToken });
}

async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const matching = await argon2.verify(user.password, oldPassword);
    if (!matching) {
      throw new BadRequestException('old password is incorrect');
    }
    user.password= newPassword;
    await this.userRepository.save(user);
    return {
      success: true,
      message: 'password updated successfully',
    };
  }














//   async create(createUserDto: CreateUserDto) : Promise<User> {
//     const user = this.userRepository.create(createUserDto);
//     return this.userRepository.save(user);
//   }

 async findAll(): Promise<User[]> {
    const users = await this.userRepository.find()
    if(users.length === 0){
      throw new NotFoundException("Aucun utilisateur trouvé");
    }
    return users;
  }



  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
    return user;
  }

 async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
const user=await this.userRepository.findBy({id})
if(!user){
throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
    const updatedUser = await this.userRepository.preload({... updateUserDto, id});  
    if (!updatedUser) {
      throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
    }
    return this.userRepository.save(updatedUser);
  }

  async updateToken(id: any, token: string) {
    const user = await this.userRepository.update(id, {
      refreshToken: token,
    });
    if (user.affected == 0) {
      throw new NotFoundException('user not found !');
    }
    return this.userRepository.findOne({ where: { id } });
  }

//   async remove(id: number) {
//     const user = await this.userRepository.findOneBy({ id });
//     if (!user) {
//       throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
//     }
//     await this.userRepository.delete(id);
//     return id;
//   }
}
