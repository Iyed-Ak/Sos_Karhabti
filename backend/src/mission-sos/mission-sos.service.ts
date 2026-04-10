import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MissionSOS, StatutMission, TypePanne } from './entities/mission-so.entity';
import { Client } from '../client/entities/client.entity';
import { Vehicule } from '../vehicule/entities/vehicule.entity';
import { Camion } from '../camion/entities/camion.entity';
import { Driver, DriverStatus } from '../driver/entities/driver.entity';
import { CreateMissionSOSDto } from './dto/create-mission-so.dto';
import { UpdateMissionSoDto } from './dto/update-mission-so.dto';
import { AffecterMissionDto } from './dto/affecter-mission.dto';

// Relations à charger par défaut pour toutes les requêtes
const RELATIONS_BASE = ['client', 'vehicule', 'camion', 'chauffeur'];

@Injectable()
export class MissionSOSService {
  constructor(
    @InjectRepository(MissionSOS)
    private missionRepository: Repository<MissionSOS>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,

    @InjectRepository(Camion)
    private camionRepository: Repository<Camion>,

    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  async create(
    createMissionSOSDto: CreateMissionSOSDto,
    clientId: number,
    vehiculeId?: number,
  ): Promise<any> {
    if (
      !createMissionSOSDto.latitudeGPS &&
      !createMissionSOSDto.longitudeGPS &&
      !createMissionSOSDto.adresseManuelle
    ) {
      return {
        success: false,
        message:
          '❌ Veuillez partager votre localisation GPS ou écrire votre adresse',
      };
    }

    // Récupérer le client
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      return { success: false, message: `❌ Client ${clientId} non trouvé` };
    }

    // Récupérer le véhicule si fourni
    let vehicule: Vehicule | null = null;
    if (vehiculeId) {
      vehicule = await this.vehiculeRepository.findOne({ where: { id: vehiculeId } });
    }

    const mission = this.missionRepository.create({
      ...createMissionSOSDto,
      client,
      vehicule: vehicule || undefined,
      statut: StatutMission.EN_ATTENTE,
    });

    const saved = await this.missionRepository.save(mission);

    // Mettre à jour le compteur de missions du client
    client.nombreMissionsSOS = (client.nombreMissionsSOS || 0) + 1;
    client.totalRequests = (client.totalRequests || 0) + 1;
    await this.clientRepository.save(client);

    return {
      success: true,
      message:
        '✅ Demande SOS envoyée ! Nous recherchons le camion le plus proche...',
      data: saved,
    };
  }

  async findAll(): Promise<any> {
    const missions = await this.missionRepository.find({
      order: { dateCreation: 'DESC' },
      relations: RELATIONS_BASE,
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) trouvée(s)`,
      count: missions.length,
      data: missions,
    };
  }

  async findOne(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: RELATIONS_BASE,
    });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    return { success: true, message: '✅ Mission trouvée', data: mission };
  }

  async findByStatut(statut: StatutMission): Promise<any> {
    const missions = await this.missionRepository.find({
      where: { statut },
      order: { dateCreation: 'DESC' },
      relations: RELATIONS_BASE,
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) avec statut ${statut}`,
      count: missions.length,
      data: missions,
    };
  }

  async findEnAttente(): Promise<any> {
    return this.findByStatut(StatutMission.EN_ATTENTE);
  }

  async findEnCours(): Promise<any> {
    return this.findByStatut(StatutMission.EN_COURS);
  }

  async findTerminees(): Promise<any> {
    return this.findByStatut(StatutMission.TERMINEE);
  }

  // ─── IMPLÉMENTÉ : missions d'un client ──────────────────────
  async findByClient(clientId: number): Promise<any> {
    const missions = await this.missionRepository.find({
      where: { client: { id: clientId } },
      order: { dateCreation: 'DESC' },
      relations: ['client', 'vehicule', 'camion', 'chauffeur'],
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) pour le client #${clientId}`,
      count: missions.length,
      data: missions,
    };
  }

  // ─── IMPLÉMENTÉ : missions d'un chauffeur ───────────────────
  async findByChauffeur(chauffeurId: number): Promise<any> {
    const missions = await this.missionRepository.find({
      where: { chauffeur: { id: chauffeurId } },
      order: { dateCreation: 'DESC' },
      relations: ['client', 'vehicule', 'camion', 'chauffeur'],
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) pour le chauffeur #${chauffeurId}`,
      count: missions.length,
      data: missions,
    };
  }

  // ─── IMPLÉMENTÉ : mission active du chauffeur ───────────────
  async findMissionActiveChauffeur(chauffeurId: number): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: {
        chauffeur: { id: chauffeurId },
        statut: StatutMission.EN_COURS,
      },
      relations: ['client', 'vehicule', 'camion', 'chauffeur'],
    });

    if (!mission) {
      return { success: false, message: '📭 Aucune mission active' };
    }

    return {
      success: true,
      message: '✅ Mission active trouvée',
      data: {
        id: mission.id,
        client: {
          nom: mission.client?.name,
          telephone: mission.client?.phone,
          adresse: mission.client?.address,
        },
        localisation:
          mission.adresseManuelle ||
          `GPS: ${mission.latitudeGPS}, ${mission.longitudeGPS}`,
        latitudeGPS: mission.latitudeGPS,
        longitudeGPS: mission.longitudeGPS,
        typePanne: mission.typePanne,
        descriptionPanne: mission.descriptionPanne,
        vehicule: mission.vehicule,
        tempsEstimeArriveeMinutes: mission.tempsEstimeArriveeMinutes,
        distanceKm: mission.distanceKm,
        dateCreation: mission.dateCreation,
        dateDebutIntervention: mission.dateDebutIntervention,
      },
    };
  }

  // ─── IMPLÉMENTÉ : historique du chauffeur ───────────────────
  async findHistoriqueChauffeur(chauffeurId: number): Promise<any> {
    const missions = await this.missionRepository.find({
      where: {
        chauffeur: { id: chauffeurId },
        statut: In([StatutMission.TERMINEE, StatutMission.ANNULEE]),
      },
      order: { dateFinIntervention: 'DESC' },
      relations: ['client', 'vehicule'],
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) dans l'historique`,
      count: missions.length,
      data: missions,
    };
  }

  // ─── AFFECTER MANUELLEMENT ──────────────────────────────────
  async affecterCamionManuellement(
    missionId: string,
    affecterDto: AffecterMissionDto,
  ): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: RELATIONS_BASE,
    });

    if (!mission) {
      return { success: false, message: `❌ Mission ${missionId} non trouvée` };
    }

    if (mission.statut !== StatutMission.EN_ATTENTE) {
      return {
        success: false,
        message: `❌ Mission déjà traitée (statut: ${mission.statut})`,
      };
    }

    const camion = await this.camionRepository.findOne({
      where: { id: affecterDto.camionId },
    });
    if (!camion || !camion.estDisponible) {
      return { success: false, message: '❌ Camion non trouvé ou indisponible' };
    }

    const driver = await this.driverRepository.findOne({
      where: { id: affecterDto.chauffeurId },
    });
    if (!driver) {
      return { success: false, message: '❌ Chauffeur non trouvé' };
    }

    // Affecter
    mission.camion = camion;
    mission.chauffeur = driver;
    mission.statut = StatutMission.EN_COURS;
    mission.affectationAutomatique = false;
    mission.dateDebutIntervention = new Date();

    // Rendre le camion indisponible
    camion.estDisponible = false;
    await this.camionRepository.save(camion);

    // Changer le statut du chauffeur
    driver.statusDriver = DriverStatus.EN_INTERVENTION;
    driver.statusUpdatedAt = new Date();
    await this.driverRepository.save(driver);

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: `✅ Mission affectée au camion #${affecterDto.camionId} et chauffeur #${affecterDto.chauffeurId}`,
      data: updated,
    };
  }

  async changerStatut(id: string, nouveauStatut: StatutMission): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['camion', 'chauffeur'],
    });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    const ancienStatut = mission.statut;
    mission.statut = nouveauStatut;

    if (
      nouveauStatut === StatutMission.EN_COURS &&
      !mission.dateDebutIntervention
    ) {
      mission.dateDebutIntervention = new Date();
    }

    if (nouveauStatut === StatutMission.TERMINEE) {
      mission.dateFinIntervention = new Date();

      // Remettre le camion disponible
      if (mission.camion) {
        mission.camion.estDisponible = true;
        await this.camionRepository.save(mission.camion);
      }

      // Remettre le chauffeur disponible
      if (mission.chauffeur) {
        mission.chauffeur.statusDriver = DriverStatus.DISPONIBLE;
        mission.chauffeur.statusUpdatedAt = new Date();
        await this.driverRepository.save(mission.chauffeur);
      }
    }

    if (nouveauStatut === StatutMission.ANNULEE) {
      // Remettre le camion disponible
      if (mission.camion) {
        mission.camion.estDisponible = true;
        await this.camionRepository.save(mission.camion);
      }
      if (mission.chauffeur) {
        mission.chauffeur.statusDriver = DriverStatus.DISPONIBLE;
        mission.chauffeur.statusUpdatedAt = new Date();
        await this.driverRepository.save(mission.chauffeur);
      }
    }

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: `✅ Statut changé de ${ancienStatut} à ${nouveauStatut}`,
      data: updated,
    };
  }

  async terminerMission(
    id: string,
    notesChauffeur?: string,
    coutIntervention?: number,
  ): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['camion', 'chauffeur'],
    });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    mission.statut = StatutMission.TERMINEE;
    mission.dateFinIntervention = new Date();
    if (notesChauffeur) mission.notesChauffeur = notesChauffeur;
    if (coutIntervention !== undefined) mission.coutIntervention = coutIntervention;

    // Libérer camion et chauffeur
    if (mission.camion) {
      mission.camion.estDisponible = true;
      await this.camionRepository.save(mission.camion);
    }

    if (mission.chauffeur) {
      mission.chauffeur.statusDriver = DriverStatus.DISPONIBLE;
      mission.chauffeur.statusUpdatedAt = new Date();
      await this.driverRepository.save(mission.chauffeur);
    }

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Mission terminée avec succès !',
      data: updated,
    };
  }

  async evaluerMission(
    id: string,
    evaluation: number,
    commentaire?: string,
  ): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    if (mission.statut !== StatutMission.TERMINEE) {
      return {
        success: false,
        message: '❌ Vous ne pouvez évaluer qu\'une mission terminée',
      };
    }

    mission.evaluation = evaluation;
    if (commentaire) mission.commentaireClient = commentaire;

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Merci pour votre évaluation !',
      data: updated,
    };
  }

  async annulerMission(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['camion', 'chauffeur'],
    });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    if (mission.statut === StatutMission.TERMINEE) {
      return {
        success: false,
        message: '❌ Impossible d\'annuler une mission terminée',
      };
    }

    mission.statut = StatutMission.ANNULEE;

    // Libérer camion et chauffeur si déjà affectés
    if (mission.camion) {
      mission.camion.estDisponible = true;
      await this.camionRepository.save(mission.camion);
    }

    if (mission.chauffeur) {
      mission.chauffeur.statusDriver = DriverStatus.DISPONIBLE;
      mission.chauffeur.statusUpdatedAt = new Date();
      await this.driverRepository.save(mission.chauffeur);
    }

    const updated = await this.missionRepository.save(mission);

    return { success: true, message: '✅ Mission annulée', data: updated };
  }

  async update(id: string, updateDto: UpdateMissionSoDto): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    Object.assign(mission, updateDto);
    const updated = await this.missionRepository.save(mission);

    return { success: true, message: '✅ Mission mise à jour !', data: updated };
  }

  async remove(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return { success: false, message: `❌ Mission ${id} non trouvée` };
    }

    await this.missionRepository.remove(mission);

    return { success: true, message: '✅ Mission supprimée !', deletedId: id };
  }

  async getStatistiques(): Promise<any> {
    const total = await this.missionRepository.count();
    const enAttente = await this.missionRepository.count({
      where: { statut: StatutMission.EN_ATTENTE },
    });
    const enCours = await this.missionRepository.count({
      where: { statut: StatutMission.EN_COURS },
    });
    const terminees = await this.missionRepository.count({
      where: { statut: StatutMission.TERMINEE },
    });
    const annulees = await this.missionRepository.count({
      where: { statut: StatutMission.ANNULEE },
    });

    const missionsTerminees = await this.missionRepository.find({
      where: { statut: StatutMission.TERMINEE },
    });

    const coutTotal = missionsTerminees.reduce(
      (sum, m) => sum + (Number(m.coutIntervention) || 0),
      0,
    );

    const evaluations = missionsTerminees
      .filter((m) => m.evaluation)
      .map((m) => m.evaluation);

    const evaluationMoyenne =
      evaluations.length > 0
        ? (evaluations.reduce((s, e) => s + e, 0) / evaluations.length).toFixed(2)
        : 'N/A';

    return {
      success: true,
      message: '📊 Statistiques des missions SOS',
      data: {
        total,
        enAttente,
        enCours,
        terminees,
        annulees,
        coutTotal: coutTotal.toFixed(2),
        evaluationMoyenne,
        tauxReussite:
          total > 0
            ? ((terminees / total) * 100).toFixed(2) + '%'
            : '0%',
      },
    };
  }
}