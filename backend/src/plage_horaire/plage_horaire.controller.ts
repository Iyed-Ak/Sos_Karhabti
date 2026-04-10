import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PlageHoraireService } from './plage_horaire.service';
import { CreatePlageHoraireDto } from './dto/create-plage_horaire.dto';
import { UpdatePlageHoraireDto } from './dto/update-plage_horaire.dto';
import { JourSemaine } from './entities/plage_horaire.entity';

@Controller('plages-horaires')
export class PlageHoraireController {
  constructor(private readonly plageHoraireService: PlageHoraireService) {}

  // POST /plages-horaires
  @Post()
  async create(@Body() createDto: CreatePlageHoraireDto, @Res() response) {
    try {
      const result = await this.plageHoraireService.create(createDto);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /plages-horaires
  @Get()
  async findAll(@Res() response) {
    try {
      const result = await this.plageHoraireService.findAll();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /plages-horaires/camion/:camionId
  @Get('camion/:camionId')
  async findByCamion(
    @Param('camionId', ParseIntPipe) camionId: number,
    @Res() response,
  ) {
    try {
      const result = await this.plageHoraireService.findByCamion(camionId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /plages-horaires/jour/:jour
  @Get('jour/:jour')
  async findByJour(@Param('jour') jour: JourSemaine, @Res() response) {
    try {
      const result = await this.plageHoraireService.findByJour(jour);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /plages-horaires/camion/:camionId/disponibilite
  @Get('camion/:camionId/disponibilite')
  async verifierDisponibilite(
    @Param('camionId', ParseIntPipe) camionId: number,
    @Res() response,
  ) {
    try {
      const result = await this.plageHoraireService.verifierDisponibilite(
        camionId,
        new Date(),
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /plages-horaires/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.plageHoraireService.findOne(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // PATCH /plages-horaires/:id
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePlageHoraireDto,
    @Res() response,
  ) {
    try {
      const result = await this.plageHoraireService.update(id, updateDto);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // DELETE /plages-horaires/:id
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.plageHoraireService.remove(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }
}