import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guards';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ============================================================
  // GESTION DES ADMINS
  // ============================================================

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto, @Res() response) {
    try {
      const result = await this.adminService.create(createAdminDto);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur lors de la création: ' + error.message,
      });
    }
  }
//@UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Res() response) {
    try {
      const result = await this.adminService.findAll();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }
//@UseGuards(AccessTokenGuard)

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.adminService.findOne(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }
//@UseGuards(AccessTokenGuard)

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @Res() response,
  ) {
    try {
      const result = await this.adminService.update(id, updateAdminDto);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }
//@UseGuards(AccessTokenGuard)

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.adminService.remove(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // ============================================================
  // GESTION DES CLIENTS (vue admin)
  // ============================================================

  @Get('clients/all')
  async getAllClients(@Res() response) {
    try {
      const result = await this.adminService.getAllClients();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Get('clients/:id')
  async getClientById(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    try {
      const result = await this.adminService.getClientById(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Delete('clients/:id')
  async deleteClient(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    try {
      const result = await this.adminService.deleteClient(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Patch('clients/:id/toggle-status')
  async toggleClientStatus(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    try {
      const result = await this.adminService.toggleClientStatus(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // ============================================================
  // GESTION DES CHAUFFEURS (vue admin)
  // ============================================================

  @Get('drivers/all')
  async getAllDrivers(@Res() response) {
    try {
      const result = await this.adminService.getAllDrivers();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Delete('drivers/:id')
  async deleteDriver(
    @Param('id', ParseIntPipe) id: number,
    @Res() response,
  ) {
    try {
      const result = await this.adminService.deleteDriver(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Post('drivers/ajouter')
  async ajouterChauffeur(@Body() body: any, @Res() response) {
    try {
      const result = await this.adminService.ajouterChauffeur(body);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // ============================================================
  // GESTION DES CAMIONS (vue admin)
  // ============================================================

  @Get('camions/all')
  async getAllCamions(@Res() response) {
    try {
      const result = await this.adminService.getAllCamions();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Post('camions/ajouter')
  async ajouterCamion(@Body() body: any, @Res() response) {
    try {
      const result = await this.adminService.ajouterCamion(body);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // ============================================================
  // GESTION DES MISSIONS SOS (vue admin)
  // ============================================================

  @Get('missions/all')
  async getAllMissions(@Res() response) {
    try {
      const result = await this.adminService.getAllMissions();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Get('missions/en-attente')
  async getMissionsEnAttente(@Res() response) {
    try {
      const result = await this.adminService.getMissionsEnAttente();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Post('missions/:id/affecter')
  async affecterMission(
    @Param('id') id: string,
    @Body() body: { camionId: number; chauffeurId: number },
    @Res() response,
  ) {
    try {
      const result = await this.adminService.affecterManuellementMission(
        id,
        body.camionId,
        body.chauffeurId,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  @Patch('missions/:id/valider')
  async validerMission(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.adminService.validerMission(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // ============================================================
  // TABLEAU DE BORD - STATISTIQUES GLOBALES
  // ============================================================

  @Get('dashboard/statistiques')
  async getStatistiques(@Res() response) {
    try {
      const result = await this.adminService.consulterStatistiques();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }
}