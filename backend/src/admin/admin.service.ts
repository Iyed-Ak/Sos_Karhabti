import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Client } from 'src/client/entities/client.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Camion } from 'src/camion/entities/camion.entity';
import { MissionSOS, StatutMission } from 'src/mission-sos/entities/mission-so.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,

    @InjectRepository(Camion)
    private camionRepository: Repository<Camion>,

    @InjectRepository(MissionSOS)
    private missionRepository: Repository<MissionSOS>,

    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,
  ) {}

  // ============================================================
  // GESTION DES ADMINS
  // ============================================================

  async create(createAdminDto: CreateAdminDto): Promise<any> {
    const existing = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existing) {
      return {
        success: false,
        message: '❌ Un admin avec cet email existe déjà',
      };
    }

    const admin = this.adminRepository.create({
      ...createAdminDto,
      role: 'admin',
    });

    const saved = await this.adminRepository.save(admin);

    return {
      success: true,
      message: '✅ Admin créé avec succès',
      data: saved,
    };
  }

  async findAll(): Promise<any> {
    const admins = await this.adminRepository.find({
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: `📋 ${admins.length} admin(s) trouvé(s)`,
      count: admins.length,
      data: admins,
    };
  }

  async findOne(id: number): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      return {
        success: false,
        message: `❌ Admin avec l'ID ${id} non trouvé`,
      };
    }

    return {
      success: true,
      message: '✅ Admin trouvé',
      data: admin,
    };
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      return {
        success: false,
        message: `❌ Admin avec l'ID ${id} non trouvé`,
      };
    }

    Object.assign(admin, updateAdminDto);
    const updated = await this.adminRepository.save(admin);

    return {
      success: true,
      message: '✅ Admin mis à jour avec succès',
      data: updated,
    };
  }

  async remove(id: number): Promise<any> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      return {
        success: false,
        message: `❌ Admin avec l'ID ${id} non trouvé`,
      };
    }

    await this.adminRepository.remove(admin);

    return {
      success: true,
      message: '✅ Admin supprimé avec succès',
      deletedId: id,
    };
  }

  // ============================================================
  // GESTION DES CLIENTS (vue admin)
  // ============================================================

  async getAllClients(): Promise<any> {
    const clients = await this.clientRepository.find({
      order: { createdAt: 'DESC' },
      // Relations à activer quand prêt:
      // relations: ['vehicules', 'missions'],
    });

    return {
      success: true,
      message: `📋 ${clients.length} client(s) trouvé(s)`,
      count: clients.length,
      data: clients,
    };
  }

  async getClientById(id: number): Promise<any> {
    const client = await this.clientRepository.findOne({
      where: { id },
      // Relations à activer quand prêt:
      // relations: ['vehicules', 'missions'],
    });

    if (!client) {
      return {
        success: false,
        message: `❌ Client avec l'ID ${id} non trouvé`,
      };
    }

    return {
      success: true,
      message: '✅ Client trouvé',
      data: client,
    };
  }

  async deleteClient(id: number): Promise<any> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      return {
        success: false,
        message: `❌ Client avec l'ID ${id} non trouvé`,
      };
    }

    await this.clientRepository.remove(client);

    return {
      success: true,
      message: '✅ Client supprimé avec succès',
      deletedId: id,
    };
  }

  async toggleClientStatus(id: number): Promise<any> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      return {
        success: false,
        message: `❌ Client avec l'ID ${id} non trouvé`,
      };
    }

    // Basculer le statut entre 'active' et 'inactive'
    client.status = client.status === 'active' ? 'inactive' : 'active';
    const updated = await this.clientRepository.save(client);

    return {
      success: true,
      message: `✅ Statut du client changé en "${updated.status}"`,
      data: updated,
    };
  }

  // ============================================================
  // GESTION DES CHAUFFEURS (vue admin)
  // ============================================================

  async getAllDrivers(): Promise<any> {
    const drivers = await this.driverRepository.find({
      order: { createdAt: 'DESC' },
      // Relations à activer quand prêt:
      // relations: ['camionAssigne', 'missions'],
    });

    return {
      success: true,
      message: `📋 ${drivers.length} chauffeur(s) trouvé(s)`,
      count: drivers.length,
      data: drivers,
    };
  }

  async deleteDriver(id: number): Promise<any> {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      return {
        success: false,
        message: `❌ Chauffeur avec l'ID ${id} non trouvé`,
      };
    }

    await this.driverRepository.remove(driver);

    return {
      success: true,
      message: '✅ Chauffeur supprimé avec succès',
      deletedId: id,
    };
  }

  // ============================================================
  // GESTION DES CAMIONS (vue admin)
  // ============================================================

  async getAllCamions(): Promise<any> {
    const camions = await this.camionRepository.find({
      order: { dateCreation: 'DESC' },
      // Relations à activer quand prêt:
      // relations: ['currentDriverId', 'missions'],
    });

    return {
      success: true,
      message: `📋 ${camions.length} camion(s) trouvé(s)`,
      count: camions.length,
      data: camions,
    };
  }

  async ajouterCamion(createCamionData: any): Promise<any> {
    // On délègue la création au repository Camion directement
    const existing = await this.camionRepository.findOne({
      where: { immatriculation: createCamionData.immatriculation },
    });

    if (existing) {
      return {
        success: false,
        message: '❌ Un camion avec cette immatriculation existe déjà',
      };
    }

    const camion = this.camionRepository.create(createCamionData);
    const saved = await this.camionRepository.save(camion);

    return {
      success: true,
      message: '✅ Camion ajouté avec succès',
      data: saved,
    };
  }

  async ajouterChauffeur(createDriverData: any): Promise<any> {
    const existing = await this.driverRepository.findOne({
      where: { email: createDriverData.email },
    });

    if (existing) {
      return {
        success: false,
        message: '❌ Un chauffeur avec cet email existe déjà',
      };
    }

    const driver = this.driverRepository.create({
      ...createDriverData,
      role: 'drivers',
    });
    const saved = await this.driverRepository.save(driver);

    return {
      success: true,
      message: '✅ Chauffeur ajouté avec succès',
      data: saved,
    };
  }

  // ============================================================
  // GESTION DES MISSIONS SOS (vue admin)
  // ============================================================

  async getAllMissions(): Promise<any> {
    const missions = await this.missionRepository.find({
      order: { dateCreation: 'DESC' },
      // Relations à activer quand prêt:
      // relations: ['client', 'camion', 'chauffeur', 'vehicule'],
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) trouvée(s)`,
      count: missions.length,
      data: missions,
    };
  }

  async getMissionsEnAttente(): Promise<any> {
    const missions = await this.missionRepository.find({
      where: { statut: StatutMission.EN_ATTENTE },
      order: { dateCreation: 'ASC' }, // Les plus anciennes en premier
      // Relations à activer quand prêt:
      // relations: ['client', 'vehicule'],
    });

    return {
      success: true,
      message: `⏳ ${missions.length} mission(s) en attente d'affectation`,
      count: missions.length,
      data: missions,
    };
  }

  async affecterManuellementMission(
    missionId: string,
    camionId: number,
    chauffeurId: number,
  ): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission ${missionId} non trouvée`,
      };
    }

    if (mission.statut !== StatutMission.EN_ATTENTE) {
      return {
        success: false,
        message: `❌ Mission déjà prise en charge (statut: ${mission.statut})`,
      };
    }

    // Vérifier que le camion existe et est disponible
    const camion = await this.camionRepository.findOne({ where: { id: camionId } });
    if (!camion) {
      return { success: false, message: `❌ Camion avec l'ID ${camionId} non trouvé` };
    }
    if (!camion.estDisponible) {
      return { success: false, message: '❌ Ce camion n\'est pas disponible' };
    }

    // Vérifier que le chauffeur existe
    const driver = await this.driverRepository.findOne({ where: { id: chauffeurId } });
    if (!driver) {
      return { success: false, message: `❌ Chauffeur avec l'ID ${chauffeurId} non trouvé` };
    }

    // Affecter le camion et le chauffeur
    // Relation à compléter quand les FK seront activées:
    // mission.camion = camion;
    // mission.chauffeur = driver;
    mission.statut = StatutMission.EN_COURS;
    mission.affectationAutomatique = false;
    mission.dateDebutIntervention = new Date();

    // Rendre le camion indisponible
    camion.estDisponible = false;
    await this.camionRepository.save(camion);

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: `✅ Mission affectée au camion #${camionId} et chauffeur #${chauffeurId}`,
      data: updated,
    };
  }

  async validerMission(missionId: string): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission ${missionId} non trouvée`,
      };
    }

    if (mission.statut !== StatutMission.EN_COURS) {
      return {
        success: false,
        message: `❌ Impossible de valider une mission avec le statut: ${mission.statut}`,
      };
    }

    mission.statut = StatutMission.TERMINEE;
    mission.dateFinIntervention = new Date();

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Mission validée et marquée comme terminée',
      data: updated,
    };
  }

  // ============================================================
  // STATISTIQUES GLOBALES (tableau de bord admin)
  // ============================================================

  async consulterStatistiques(): Promise<any> {
    const totalClients = await this.clientRepository.count();
    const totalDrivers = await this.driverRepository.count();
    const totalCamions = await this.camionRepository.count();
    const camionsDisponibles = await this.camionRepository.count({
      where: { estDisponible: true },
    });
    const totalVehicules = await this.vehiculeRepository.count();

    const totalMissions = await this.missionRepository.count();
    const missionsEnAttente = await this.missionRepository.count({
      where: { statut: StatutMission.EN_ATTENTE },
    });
    const missionsEnCours = await this.missionRepository.count({
      where: { statut: StatutMission.EN_COURS },
    });
    const missionsTerminees = await this.missionRepository.count({
      where: { statut: StatutMission.TERMINEE },
    });

    // Coût total des interventions
    const missionsAvecCout = await this.missionRepository.find({
      where: { statut: StatutMission.TERMINEE },
    });
    const coutTotal = missionsAvecCout.reduce(
      (sum, m) => sum + (Number(m.coutIntervention) || 0),
      0,
    );

    return {
      success: true,
      message: '📊 Statistiques globales de la plateforme',
      data: {
        utilisateurs: {
          totalClients,
          totalDrivers,
          totalAdmins: await this.adminRepository.count(),
        },
        vehicules: {
          totalVehicules,
          totalCamions,
          camionsDisponibles,
          camionsEnMission: totalCamions - camionsDisponibles,
        },
        missions: {
          total: totalMissions,
          enAttente: missionsEnAttente,
          enCours: missionsEnCours,
          terminees: missionsTerminees,
          tauxReussite:
            totalMissions > 0
              ? ((missionsTerminees / totalMissions) * 100).toFixed(2) + '%'
              : '0%',
        },
        financier: {
          coutTotalInterventions: coutTotal.toFixed(2),
          coutMoyenParMission:
            missionsTerminees > 0
              ? (coutTotal / missionsTerminees).toFixed(2)
              : '0',
        },
      },
    };
  }
}