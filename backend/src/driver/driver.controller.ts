import {
  Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe,Res,HttpStatus,} from '@nestjs/common';
import { DriversService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  


  // ─── ROUTES SANS PARAMÈTRE ────────────────────────────────────

  @Post()
  async create(@Body() createDriverDto: CreateDriverDto, @Res() response) {
    try {
      const result = await this.driversService.create(createDriverDto);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const result = await this.driversService.findAll();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  // ─── ROUTES :id/sous-chemin EN PREMIER ─────────────────────
  // IMPORTANT : toujours avant les routes :id seul

  @Post(':id/assigner-camion')
  async assignerCamion(
    @Param('id', ParseIntPipe) id: number,
    @Body('camionId') camionId: number,
    @Res() response,
  ) {
    try {
      const result = await this.driversService.assignerCamion(id, camionId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get(':id/camion')
  async getCamionAssigne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    try {
      const result = await this.driversService.getCamionAssigne(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get(':id/missions')
  async getMissions(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.driversService.getMissions(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Delete(':id/retirer-camion')
  async retirerCamion(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.driversService.retirerCamion(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  // ─── ROUTES :id SEUL EN DERNIER ────────────────────────────

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.driversService.findOne(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
    @Res() response,
  ) {
    try {
      const result = await this.driversService.update(id, updateDriverDto);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.driversService.remove(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }
}