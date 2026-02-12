import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('vehicules')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image", {
      storage:diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
      })
    }))
  async create(@Body() createVehiculeDto: CreateVehiculeDto, @Res() response, @UploadedFile() image) {
    try {
      createVehiculeDto.image = image? image.filename:null;
      const vehicule = await this.vehiculeService.create(createVehiculeDto)
      return response.status(HttpStatus.CREATED).json({
        message: "vehicule create avec succes",
        vehicule
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la creation " + error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const vehicule = await this.vehiculeService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "this all vehicules",
        vehicule,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const vehicule = await this.vehiculeService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "this vehicule",
        vehicule,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur vehicule not found " + error.message,
      });
    }
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number, @Res() response) {
    try {
      const vehicules = await this.vehiculeService.findByUser(userId);
      return response.status(HttpStatus.OK).json({
        message: "vehicules of user",
        vehicules,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get('plaque/:plaque')
  async findByPlaque(@Param('plaque') plaque: string, @Res() response) {
    try {
      const vehicule = await this.vehiculeService.findByPlaque(plaque);
      return response.status(HttpStatus.OK).json({
        message: "vehicule found by plaque",
        vehicule,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur vehicule not found " + error.message,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiculeDto: UpdateVehiculeDto,
    @Res() response
  ) {
    try {
      const updatedVehicule = await this.vehiculeService.update(id, updateVehiculeDto);
      return response.status(HttpStatus.OK).json({
        message: "vehicule updated with success",
        updatedVehicule
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  @Patch(':id/kilometrage')
  async updateKilometrage(
    @Param('id', ParseIntPipe) id: number,
    @Body('kilometrage') kilometrage: number,
    @Res() response
  ) {
    try {
      const updatedVehicule = await this.vehiculeService.updateKilometrage(id, kilometrage);
      return response.status(HttpStatus.OK).json({
        message: "kilometrage updated with success",
        updatedVehicule
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const vehicule = await this.vehiculeService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "vehicule deleted with success",
        vehicule
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la suppression " + error.message,
      });
    }
  }
}