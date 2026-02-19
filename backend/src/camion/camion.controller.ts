import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CamionService } from './camion.service';
import { CreateCamionDto } from './dto/create-camion.dto';
import { UpdateCamionDto } from './dto/update-camion.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('camions')
export class CamionController {
  constructor(private readonly camionService: CamionService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image", {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}${extname(file.originalname)}`);
      }
    })
  }))
  async create(@Body() createCamionDto: CreateCamionDto, @Res() response, @UploadedFile() image) {
    try {
      createCamionDto.image = image ? image.filename : null;
      const camion = await this.camionService.create(createCamionDto);
      return response.status(HttpStatus.CREATED).json({
        message: "camion créé avec succès",
        camion
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la création " + error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const camion = await this.camionService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "liste de tous les camions",
        camion,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get('disponibles')
  async findDisponibles(@Res() response) {
    try {
      const camion = await this.camionService.findDisponibles();
      return response.status(HttpStatus.OK).json({
        message: "liste des camions disponibles",
        camion,
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
      const camion = await this.camionService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "camion trouvé",
        camion,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur camion not found " + error.message,
      });
    }
  }

  @Get('immatriculation/:immatriculation')
  async findByImmatriculation(@Param('immatriculation') immatriculation: string, @Res() response) {
    try {
      const camion = await this.camionService.findByImmatriculation(immatriculation);
      return response.status(HttpStatus.OK).json({
        message: "camion trouvé par immatriculation",
        camion,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur camion not found " + error.message,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCamionDto: UpdateCamionDto,
    @Res() response
  ) {
    try {
      const updatedCamion = await this.camionService.update(id, updateCamionDto);
      return response.status(HttpStatus.OK).json({
        message: "camion mis à jour avec succès",
        updatedCamion
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
      const updatedCamion = await this.camionService.updateKilometrage(id, kilometrage);
      return response.status(HttpStatus.OK).json({
        message: "kilométrage mis à jour avec succès",
        updatedCamion
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  @Patch(':id/disponibilite')
  async changerDisponibilite(
    @Param('id', ParseIntPipe) id: number,
    @Body('estDisponible') estDisponible: boolean,
    @Res() response
  ) {
    try {
      const updatedCamion = await this.camionService.changerDisponibilite(id, estDisponible);
      return response.status(HttpStatus.OK).json({
        message: "disponibilité mise à jour avec succès",
        updatedCamion
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  @Patch(':id/planning')
  async mettreAJourPlanning(
    @Param('id', ParseIntPipe) id: number,
    @Body('planningHoraire') planningHoraire: string,
    @Res() response
  ) {
    try {
      const updatedCamion = await this.camionService.mettreAJourPlanning(id, planningHoraire);
      return response.status(HttpStatus.OK).json({
        message: "planning mis à jour avec succès",
        updatedCamion
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  // @Patch(':id/assigner-chauffeur')
  // async assignerChauffeur(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body('chauffeurId') chauffeurId: number,
  //   @Res() response
  // ) {
  //   try {
  //     const updatedCamion = await this.camionService.assignerChauffeur(id, chauffeurId);
  //     return response.status(HttpStatus.OK).json({
  //       message: "chauffeur assigné avec succès",
  //       updatedCamion
  //     });
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode: 400,
  //       message: "erreur lors de l'assignation " + error.message,
  //     });
  //   }
  // }

  // @Patch(':id/retirer-chauffeur')
  // async retirerChauffeur(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Res() response
  // ) {
  //   try {
  //     const updatedCamion = await this.camionService.retirerChauffeur(id);
  //     return response.status(HttpStatus.OK).json({
  //       message: "chauffeur retiré avec succès",
  //       updatedCamion
  //     });
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode: 400,
  //       message: "erreur lors du retrait " + error.message,
  //     });
  //   }
  // }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const camion = await this.camionService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "camion supprimé avec succès",
        camion
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la suppression " + error.message,
      });
    }
  }

  // @Get('avec-chauffeur')
  // async findAllWithDriver(@Res() response) {
  //   try {
  //     const result = await this.camionService.findAllWithDriver();
  //     return response.status(HttpStatus.OK).json({
  //       message: "liste des camions avec chauffeur",
  //       result,
  //     });
  //   } catch (error) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode: 400,
  //       message: "erreur data not found " + error.message,
  //     });
  //   }
  // }
}