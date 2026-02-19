import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
//   async create(createUserDto: CreateUserDto) : Promise<User> {
//     const user = this.userRepository.create(createUserDto);
//     return this.userRepository.save(user);
//   }

//  async findAll(): Promise<User[]> {
//     const users = await this.userRepository.find()
//     if(users.length === 0){
//       throw new NotFoundException("Aucun utilisateur trouvé");
//     }
//     return users;
//   }



//   async findOne(id: number): Promise<User> {
//     const user = await this.userRepository.findOneBy({ id });
//     if (!user) {
//       throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
//     }
//     return user;
//   }

//   async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
//     const user=await this.userRepository.findBy({id})
//     if(!user){
//       throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
//     }
//     const updatedUser = await this.userRepository.preload({... updateUserDto, id});  
//     if (!updatedUser) {
//       throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
//     }
//     return this.userRepository.save(updatedUser);
//   }

//   async remove(id: number) {
//     const user = await this.userRepository.findOneBy({ id });
//     if (!user) {
//       throw new NotFoundException(`Utilisateur avec l'id ${id} non trouvé`);
//     }
//     await this.userRepository.delete(id);
//     return id;
//   }
}
