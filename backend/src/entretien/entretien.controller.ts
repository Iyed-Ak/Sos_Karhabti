import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { EntretienService } from './entretien.service';
import { CreateEntretienDto } from './dto/create-entretien.dto';
import { UpdateEntretienDto } from './dto/update-entretien.dto';
import { Response } from 'express';
import { TypeEntretien } from './entities/entretien.entity';

@Controller('entretiens')
export class EntretienController {
  constructor(private readonly entretienService: EntretienService) {}

  @Post()
  async create(@Body() createEntretienDto: CreateEntretienDto, @Res() response) {
    try {
      const entretien = await this.entretienService.create(createEntretienDto);
      return response.status(HttpStatus.CREATED).json({
        message: "entretien créé avec succès",
        entretien
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
      const entretien = await this.entretienService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "liste de tous les entretiens",
        entretien,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get('statistiques')
  async getStatistiques(@Res() response) {
    try {
      const stats = await this.entretienService.getStatistiques();
      return response.status(HttpStatus.OK).json({
        message: "statistiques des entretiens",
        stats,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la récupération des statistiques " + error.message,
      });
    }
  }

  @Get('a-venir')
  async findAVenir(@Res() response) {
    try {
      const entretien = await this.entretienService.findAVenir();
      return response.status(HttpStatus.OK).json({
        message: "liste des entretiens à venir",
        entretien,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get('realises')
  async findRealises(@Res() response) {
    try {
      const entretien = await this.entretienService.findRealises();
      return response.status(HttpStatus.OK).json({
        message: "liste des entretiens réalisés",
        entretien,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get('type/:type')
  async findByType(@Param('type') type: TypeEntretien, @Res() response) {
    try {
      const entretien = await this.entretienService.findByType(type);
      return response.status(HttpStatus.OK).json({
        message: `liste des entretiens de type ${type}`,
        entretien,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get('vehicule/:vehiculeId')
  async findByVehicule(@Param('vehiculeId', ParseIntPipe) vehiculeId: number, @Res() response) {
    try {
      const entretien = await this.entretienService.findByVehicule(vehiculeId);
      return response.status(HttpStatus.OK).json({
        message: "liste des entretiens du véhicule",
        entretien,
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
      const entretien = await this.entretienService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "entretien trouvé",
        entretien,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur entretien not found " + error.message,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEntretienDto: UpdateEntretienDto,
    @Res() response
  ) {
    try {
      const updatedEntretien = await this.entretienService.update(id, updateEntretienDto);
      return response.status(HttpStatus.OK).json({
        message: "entretien mis à jour avec succès",
        updatedEntretien
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  @Patch(':id/realiser')
  async marquerCommeRealise(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { dateRealisee: string; kilometrageRealise?: number; cout?: number },
    @Res() response
  ) {
    try {
      const updatedEntretien = await this.entretienService.marquerCommRealise(
        id,
        new Date(body.dateRealisee),
        body.kilometrageRealise,
        body.cout
      );
      return response.status(HttpStatus.OK).json({
        message: "entretien marqué comme réalisé",
        updatedEntretien
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
      const entretien = await this.entretienService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "entretien supprimé avec succès",
        entretien
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la suppression " + error.message,
      });
    }
  }
}