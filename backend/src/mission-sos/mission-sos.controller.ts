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
} from '@nestjs/common';
import { MissionSOSService } from './mission-sos.service';
import { CreateMissionSOSDto } from './dto/create-mission-so.dto';
import { UpdateMissionSoDto } from './dto/update-mission-so.dto';
import { AffecterMissionDto } from './dto/affecter-mission.dto';
import { StatutMission } from './entities/mission-so.entity';

@Controller('missions-sos')
export class MissionSOSController {
  constructor(private readonly missionSOSService: MissionSOSService) {}

  // POST /missions-sos → créer une mission SOS
  // Body doit inclure clientId et optionnellement vehiculeId
  @Post()
  async create(
    @Body()
    body: CreateMissionSOSDto & { clientId: number; vehiculeId?: number },
    @Res() response,
  ) {
    try {
      const { clientId, vehiculeId, ...missionDto } = body;
      const result = await this.missionSOSService.create(
        missionDto,
        clientId,
        vehiculeId,
      );
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
      const result = await this.missionSOSService.findAll();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('statistiques')
  async getStatistiques(@Res() response) {
    try {
      const result = await this.missionSOSService.getStatistiques();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('en-attente')
  async findEnAttente(@Res() response) {
    try {
      const result = await this.missionSOSService.findEnAttente();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('en-cours')
  async findEnCours(@Res() response) {
    try {
      const result = await this.missionSOSService.findEnCours();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('terminees')
  async findTerminees(@Res() response) {
    try {
      const result = await this.missionSOSService.findTerminees();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('client/:clientId')
  async findByClient(@Param('clientId') clientId: number, @Res() response) {
    try {
      const result = await this.missionSOSService.findByClient(+clientId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('chauffeur/:chauffeurId')
  async findByChauffeur(
    @Param('chauffeurId') chauffeurId: number,
    @Res() response,
  ) {
    try {
      const result = await this.missionSOSService.findByChauffeur(+chauffeurId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('chauffeur/:chauffeurId/active')
  async findMissionActiveChauffeur(
    @Param('chauffeurId') chauffeurId: number,
    @Res() response,
  ) {
    try {
      const result =
        await this.missionSOSService.findMissionActiveChauffeur(+chauffeurId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get('chauffeur/:chauffeurId/historique')
  async findHistoriqueChauffeur(
    @Param('chauffeurId') chauffeurId: number,
    @Res() response,
  ) {
    try {
      const result =
        await this.missionSOSService.findHistoriqueChauffeur(+chauffeurId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.missionSOSService.findOne(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Post(':id/affecter-manuellement')
  async affecterManuellement(
    @Param('id') id: string,
    @Body() affecterDto: AffecterMissionDto,
    @Res() response,
  ) {
    try {
      const result = await this.missionSOSService.affecterCamionManuellement(
        id,
        affecterDto,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Patch(':id/statut')
  async changerStatut(
    @Param('id') id: string,
    @Body('statut') statut: StatutMission,
    @Res() response,
  ) {
    try {
      const result = await this.missionSOSService.changerStatut(id, statut);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Patch(':id/terminer')
  async terminerMission(
    @Param('id') id: string,
    @Body() body: { notesChauffeur?: string; coutIntervention?: number },
    @Res() response,
  ) {
    try {
      const result = await this.missionSOSService.terminerMission(
        id,
        body.notesChauffeur,
        body.coutIntervention,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Patch(':id/evaluer')
  async evaluerMission(
    @Param('id') id: string,
    @Body() body: { evaluation: number; commentaire?: string },
    @Res() response,
  ) {
    try {
      const result = await this.missionSOSService.evaluerMission(
        id,
        body.evaluation,
        body.commentaire,
      );
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Patch(':id/annuler')
  async annulerMission(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.missionSOSService.annulerMission(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMissionSoDto,
    @Res() response,
  ) {
    try {
      const result = await this.missionSOSService.update(id, updateDto);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.missionSOSService.remove(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: error.message });
    }
  }
}