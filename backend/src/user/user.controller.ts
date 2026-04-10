import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { response } from 'express';
import { updatePasswordDto } from './updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto, @Res() response) {
  //   try {
  //     const user = await this.userService.create(createUserDto)
  //     return response.status(HttpStatus.CREATED).json({
  //       message:"user create avec succes",
  //       user
  //     })
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode:400,
  //       message:"erreur lors de la creation "+error.message,
  //     })

  //   }
  // }

  // @Get()
  // async findAll(@Res() response) {
  //   try {
  //     const user = await this.userService.findAll()
  //     return response.status(HttpStatus.OK).json({
  //       message:"this all users",user,
        
  //     })
  //   }
  //     catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode:400,
  //       message:"erreur data not found "+error.message,
  //     })

  //   }
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: number, @Res() response) {
  //   try {
  //     const user = await this.userService.findOne(id)
  //     return response.status(HttpStatus.OK).json({
  //       message:"this user",user,
        
  //     })
  //   }
  //     catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode:400,
  //       message:"erreur user not found"+error.message,
  //     })
  //   }
  // }

  // @Patch(':id')
  // async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Res() response) {
  //   try {
  //     const updatedUser = await this.userService.update(id, updateUserDto)
  //     return response.status(HttpStatus.OK).json({
  //       message:"user updated with success",
  //       updatedUser
  //     })
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode:400,
  //       message:"erreur lors de la mise à jour "+error.message,
  //     })
  //   }
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: number, @Res() response) {
  //   try {
  //     const user = await this.userService.remove(id)
  //     return response.status(HttpStatus.OK).json({
  //       message:"user deleted with success",
  //       user
  //     })
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode:400,
  //       message:"erreur lors de la suppression "+error.message,
  //     })
  //   }
  // }

  @Put('/update-password/:id')
  async updatePassword(@Body()  UpdatPasswordDto : updatePasswordDto, @Res() res, @Param('id') id: number ){
    try {
      const updatedPassword = await this.userService.updatePassword(id, UpdatPasswordDto.oldPassword, UpdatPasswordDto.newPassword) ;
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "password updated"
      }) ;
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success : false,
        message: "password not updated" + error
      })
    }
  }
}
