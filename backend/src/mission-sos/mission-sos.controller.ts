import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { MissionSOSService } from './mission-sos.service';
import { CreateMissionSOSDto } from './dto/create-mission-so.dto';
import { UpdateMissionSoDto } from './dto/update-mission-so.dto';
import { AffecterMissionDto } from './dto/affecter-mission.dto';
import { Response } from 'express';
import { StatutMission } from './entities/mission-so.entity';

@Controller('missions-sos')
export class MissionSOSController {
  constructor(private readonly missionSOSService: MissionSOSService) {}

  /**
   * POST /missions-sos
   * Créer une demande SOS (client connecté)
   * Le nom et téléphone sont récupérés automatiquement du client connecté
   */
  @Post()
  async create(@Body() createMissionSOSDto: CreateMissionSOSDto, @Res() response) {
    try {
      // TODO: Récupérer les infos du client connecté depuis le JWT/session
      // Pour le moment, simulons avec des données fictives
      const clientData = {
        nom: 'Client Test', // À remplacer par req.user.name
        telephone: '+216 12 345 678', // À remplacer par req.user.phone
      };

      const mission = await this.missionSOSService.create(createMissionSOSDto, clientData);
      return response.status(HttpStatus.CREATED).json({
        message: "demande SOS créée avec succès",
        mission
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la création " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos
   * Liste toutes les missions
   */
  @Get()
  async findAll(@Res() response) {
    try {
      const mission = await this.missionSOSService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "liste de toutes les missions SOS",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/statistiques
   * Statistiques des missions
   */
  @Get('statistiques')
  async getStatistiques(@Res() response) {
    try {
      const stats = await this.missionSOSService.getStatistiques();
      return response.status(HttpStatus.OK).json({
        message: "statistiques des missions",
        stats,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la récupération des statistiques " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/en-attente
   * Missions en attente d'affectation
   */
  @Get('en-attente')
  async findEnAttente(@Res() response) {
    try {
      const mission = await this.missionSOSService.findEnAttente();
      return response.status(HttpStatus.OK).json({
        message: "liste des missions en attente",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/en-cours
   * Missions en cours
   */
  @Get('en-cours')
  async findEnCours(@Res() response) {
    try {
      const mission = await this.missionSOSService.findEnCours();
      return response.status(HttpStatus.OK).json({
        message: "liste des missions en cours",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/terminees
   * Missions terminées
   */
  @Get('terminees')
  async findTerminees(@Res() response) {
    try {
      const mission = await this.missionSOSService.findTerminees();
      return response.status(HttpStatus.OK).json({
        message: "liste des missions terminées",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/client/:clientId
   * Missions d'un client spécifique
   */
  @Get('client/:clientId')
  async findByClient(@Param('clientId') clientId: number, @Res() response) {
    try {
      const mission = await this.missionSOSService.findByClient(clientId);
      return response.status(HttpStatus.OK).json({
        message: "missions du client",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/chauffeur/:chauffeurId
   * Toutes les missions d'un chauffeur (historique complet)
   */
  @Get('chauffeur/:chauffeurId')
  async findByChauffeur(@Param('chauffeurId') chauffeurId: number, @Res() response) {
    try {
      const mission = await this.missionSOSService.findByChauffeur(chauffeurId);
      return response.status(HttpStatus.OK).json({
        message: "toutes les missions du chauffeur",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/chauffeur/:chauffeurId/active
   * Mission active du chauffeur (EN_COURS)
   * Le chauffeur reçoit toutes les infos: nom client, téléphone, adresse, GPS, type panne, description
   */
  @Get('chauffeur/:chauffeurId/active')
  async findMissionActiveChauffeur(@Param('chauffeurId') chauffeurId: number, @Res() response) {
    try {
      const mission = await this.missionSOSService.findMissionActiveChauffeur(chauffeurId);
      return response.status(HttpStatus.OK).json({
        message: "mission active du chauffeur avec toutes les informations",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/chauffeur/:chauffeurId/historique
   * Historique des missions du chauffeur (TERMINEE + ANNULEE)
   */
  @Get('chauffeur/:chauffeurId/historique')
  async findHistoriqueChauffeur(@Param('chauffeurId') chauffeurId: number, @Res() response) {
    try {
      const mission = await this.missionSOSService.findHistoriqueChauffeur(chauffeurId);
      return response.status(HttpStatus.OK).json({
        message: "historique des missions du chauffeur",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  /**
   * GET /missions-sos/:id
   * Détails d'une mission
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    try {
      const mission = await this.missionSOSService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "mission trouvée",
        mission,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur mission not found " + error.message,
      });
    }
  }

  /**
   * POST /missions-sos/:id/affecter-automatique
   * Affecter automatiquement le camion le plus proche
   */
  @Post(':id/affecter-automatique')
  async affecterAutomatique(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.missionSOSService.affecterCamionAutomatique(id);
      return response.status(HttpStatus.OK).json({
        message: "affectation automatique",
        result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de l'affectation " + error.message,
      });
    }
  }

  /**
   * POST /missions-sos/:id/affecter-manuellement
   * Affecter manuellement un camion et un chauffeur (admin)
   */
  @Post(':id/affecter-manuellement')
  async affecterManuellement(
    @Param('id') id: string,
    @Body() affecterDto: AffecterMissionDto,
    @Res() response
  ) {
    try {
      const result = await this.missionSOSService.affecterCamionManuellement(id, affecterDto);
      return response.status(HttpStatus.OK).json({
        message: "affectation manuelle réussie",
        result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de l'affectation " + error.message,
      });
    }
  }

  /**
   * PATCH /missions-sos/:id/statut
   * Changer le statut de la mission
   */
  @Patch(':id/statut')
  async changerStatut(
    @Param('id') id: string,
    @Body('statut') statut: StatutMission,
    @Res() response
  ) {
    try {
      const result = await this.missionSOSService.changerStatut(id, statut);
      return response.status(HttpStatus.OK).json({
        message: "statut changé",
        result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors du changement de statut " + error.message,
      });
    }
  }

  /**
   * PATCH /missions-sos/:id/terminer
   * Terminer une mission avec notes du chauffeur
   */
  @Patch(':id/terminer')
  async terminerMission(
    @Param('id') id: string,
    @Body() body: { notesChauffeur?: string; coutIntervention?: number },
    @Res() response
  ) {
    try {
      const result = await this.missionSOSService.terminerMission(
        id,
        body.notesChauffeur,
        body.coutIntervention
      );
      return response.status(HttpStatus.OK).json({
        message: "mission terminée",
        result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la terminaison " + error.message,
      });
    }
  }

  /**
   * PATCH /missions-sos/:id/evaluer
   * Evaluer une mission (client)
   */
  @Patch(':id/evaluer')
  async evaluerMission(
    @Param('id') id: string,
    @Body() body: { evaluation: number; commentaire?: string },
    @Res() response
  ) {
    try {
      const result = await this.missionSOSService.evaluerMission(
        id,
        body.evaluation,
        body.commentaire
      );
      return response.status(HttpStatus.OK).json({
        message: "évaluation enregistrée",
        result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de l'évaluation " + error.message,
      });
    }
  }

  /**
   * PATCH /missions-sos/:id/annuler
   * Annuler une mission
   */
  @Patch(':id/annuler')
  async annulerMission(@Param('id') id: string, @Res() response) {
    try {
      const result = await this.missionSOSService.annulerMission(id);
      return response.status(HttpStatus.OK).json({
        message: "mission annulée",
        result,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de l'annulation " + error.message,
      });
    }
  }

  /**
   * PATCH /missions-sos/:id
   * Mettre à jour une mission
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMissionSOSDto: UpdateMissionSoDto,
    @Res() response
  ) {
    try {
      const updatedMission = await this.missionSOSService.update(id, updateMissionSOSDto);
      return response.status(HttpStatus.OK).json({
        message: "mission mise à jour avec succès",
        updatedMission
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  /**
   * DELETE /missions-sos/:id
   * Supprimer une mission
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const mission = await this.missionSOSService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "mission supprimée avec succès",
        mission
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la suppression " + error.message,
      });
    }
  }
}