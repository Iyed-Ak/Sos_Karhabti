import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissionSOS, StatutMission, TypePanne } from './entities/mission-so.entity';
import { CreateMissionSOSDto } from './dto/create-mission-so.dto';
import {  UpdateMissionSoDto } from './dto/update-mission-so.dto';
import { AffecterMissionDto } from './dto/affecter-mission.dto';

@Injectable()
export class MissionSOSService {
  constructor(
    @InjectRepository(MissionSOS)
    private missionRepository: Repository<MissionSOS>,
  ) {}

  /**
   * Créer une nouvelle demande SOS
   * Le client est connecté, donc on récupère automatiquement son nom et téléphone
   */
  async create(createMissionSOSDto: CreateMissionSOSDto, clientData: { nom: string; telephone: string }): Promise<any> {
    // Vérifier qu'au moins GPS ou adresse manuelle est fourni
    if (!createMissionSOSDto.latitudeGPS && !createMissionSOSDto.longitudeGPS && !createMissionSOSDto.adresseManuelle) {
      return {
        success: false,
        message: '❌ Veuillez partager votre localisation GPS ou écrire votre adresse',
      };
    }

    // Créer la mission avec statut EN_ATTENTE par défaut
    const mission = this.missionRepository.create({
      ...createMissionSOSDto,
      nomClient: clientData.nom,
      telephoneClient: clientData.telephone,
      statut: StatutMission.EN_ATTENTE,
    });

    const saved = await this.missionRepository.save(mission);
    
    return {
      success: true,
      message: '✅ Demande SOS envoyée avec succès ! Nous recherchons le camion le plus proche...',
      data: saved,
    };
  }

  /**
   * Récupérer toutes les missions
   */
  async findAll(): Promise<any> {
    const missions = await this.missionRepository.find({
      order: { dateCreation: 'DESC' },
      // Relations à ajouter plus tard:
      // relations: ['client', 'vehicule', 'camion', 'chauffeur'],
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) trouvée(s)`,
      count: missions.length,
      data: missions,
    };
  }

  /**
   * Récupérer une mission par son ID
   */
  async findOne(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      // Relations à ajouter plus tard:
      // relations: ['client', 'vehicule', 'camion', 'chauffeur'],
    });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    return {
      success: true,
      message: '✅ Mission trouvée',
      data: mission,
    };
  }

  /**
   * Récupérer les missions par statut
   */
  async findByStatut(statut: StatutMission): Promise<any> {
    const missions = await this.missionRepository.find({
      where: { statut },
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      message: `📋 ${missions.length} mission(s) avec statut ${statut}`,
      count: missions.length,
      data: missions,
    };
  }

  /**
   * Récupérer les missions en attente
   */
  async findEnAttente(): Promise<any> {
    return this.findByStatut(StatutMission.EN_ATTENTE);
  }

  /**
   * Récupérer les missions en cours
   */
  async findEnCours(): Promise<any> {
    return this.findByStatut(StatutMission.EN_COURS);
  }

  /**
   * Récupérer les missions terminées
   */
  async findTerminees(): Promise<any> {
    return this.findByStatut(StatutMission.TERMINEE);
  }

  /**
   * Récupérer les missions d'un client
   * À implémenter quand la relation Client sera ajoutée
   */
  async findByClient(clientId: number): Promise<any> {
    // TODO: Implémenter quand la relation Client sera ajoutée
    // const missions = await this.missionRepository.find({
    //   where: { clientId },
    //   order: { dateCreation: 'DESC' },
    //   relations: ['camion', 'chauffeur', 'vehicule'],
    // });

    return {
      success: false,
      message: '⚠️ Méthode findByClient() à implémenter avec la relation Client',
    };
  }

  /**
   * Récupérer les missions d'un chauffeur (toutes)
   * Le chauffeur voit toutes ses missions affectées
   */
  async findByChauffeur(chauffeurId: number): Promise<any> {
    // TODO: Implémenter quand la relation Chauffeur sera ajoutée
    // const missions = await this.missionRepository.find({
    //   where: { chauffeurId },
    //   order: { dateCreation: 'DESC' },
    //   relations: ['client', 'vehicule', 'camion'],
    // });

    return {
      success: false,
      message: '⚠️ Méthode findByChauffeur() à implémenter avec la relation Chauffeur',
      // Exemple de ce qui sera retourné:
      // data: missions (avec toutes les infos: nom client, téléphone, adresse, type panne, description, etc.)
    };
  }

  /**
   * Récupérer les missions actives d'un chauffeur (EN_COURS uniquement)
   * Le chauffeur voit sa mission en cours avec toutes les informations
   */
  async findMissionActiveChauffeur(chauffeurId: number): Promise<any> {
    // TODO: Implémenter quand la relation Chauffeur sera ajoutée
    // const mission = await this.missionRepository.findOne({
    //   where: { 
    //     chauffeurId,
    //     statut: StatutMission.EN_COURS 
    //   },
    //   relations: ['client', 'vehicule', 'camion'],
    // });

    // if (!mission) {
    //   return {
    //     success: false,
    //     message: '📭 Aucune mission active',
    //   };
    // }

    // return {
    //   success: true,
    //   message: '✅ Mission active trouvée',
    //   data: {
    //     id: mission.id,
    //     nomClient: mission.nomClient,
    //     telephoneClient: mission.telephoneClient,
    //     adresse: mission.adresseManuelle || `GPS: ${mission.latitudeGPS}, ${mission.longitudeGPS}`,
    //     latitudeGPS: mission.latitudeGPS,
    //     longitudeGPS: mission.longitudeGPS,
    //     typePanne: mission.typePanne,
    //     descriptionPanne: mission.descriptionPanne,
    //     tempsEstimeArriveeMinutes: mission.tempsEstimeArriveeMinutes,
    //     distanceKm: mission.distanceKm,
    //     dateCreation: mission.dateCreation,
    //     dateDebutIntervention: mission.dateDebutIntervention,
    //     vehicule: mission.vehicule, // Infos du véhicule du client
    //   },
    // };

    return {
      success: false,
      message: '⚠️ Méthode findMissionActiveChauffeur() à implémenter avec la relation Chauffeur',
    };
  }

  /**
   * Récupérer l'historique des missions d'un chauffeur (TERMINEE + ANNULEE)
   */
  async findHistoriqueChauffeur(chauffeurId: number): Promise<any> {
    // TODO: Implémenter quand la relation Chauffeur sera ajoutée
    // const missions = await this.missionRepository.find({
    //   where: { 
    //     chauffeurId,
    //     statut: In([StatutMission.TERMINEE, StatutMission.ANNULEE])
    //   },
    //   order: { dateFinIntervention: 'DESC' },
    //   relations: ['client', 'vehicule'],
    // });

    return {
      success: false,
      message: '⚠️ Méthode findHistoriqueChauffeur() à implémenter avec la relation Chauffeur',
    };
  }

  /**
   * Affecter automatiquement le camion le plus proche disponible
   * Cette méthode sera implémentée quand l'entité Camion et la géolocalisation seront disponibles
   */
  async affecterCamionAutomatique(missionId: string): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id: missionId } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${missionId} non trouvée`,
      };
    }

    // TODO: Implémenter la logique pour trouver le camion le plus proche
    // 1. Récupérer tous les camions disponibles
    // 2. Calculer la distance entre chaque camion et la position du client
    // 3. Sélectionner le camion le plus proche
    // 4. Calculer le temps estimé d'arrivée
    // 5. Affecter le camion et son chauffeur à la mission
    // 6. Changer le statut de la mission à EN_COURS
    // 7. Mettre à jour la disponibilité du camion

    // Exemple de logique (à compléter):
    // const camions = await camionRepository.find({ where: { estDisponible: true } });
    // const camionPlusProche = calculerCamionPlusProche(mission.latitudeGPS, mission.longitudeGPS, camions);
    // mission.camionId = camionPlusProche.id;
    // mission.chauffeurId = camionPlusProche.chauffeurId;
    // mission.statut = StatutMission.EN_COURS;
    // mission.affectationAutomatique = true;
    // mission.tempsEstimeArriveeMinutes = calculerTempsEstime(distance);
    // mission.distanceKm = distance;
    // mission.dateDebutIntervention = new Date();

    return {
      success: false,
      message: '⚠️ Méthode affecterCamionAutomatique() à implémenter avec les entités Camion et Driver',
    };
  }

  /**
   * Affecter manuellement un camion et un chauffeur (par l'admin)
   */
  async affecterCamionManuellement(missionId: string, affecterDto: AffecterMissionDto): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id: missionId } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${missionId} non trouvée`,
      };
    }

    if (mission.statut !== StatutMission.EN_ATTENTE) {
      return {
        success: false,
        message: `❌ Cette mission n'est plus en attente (statut actuel: ${mission.statut})`,
      };
    }

    // TODO: Vérifier que le camion et le chauffeur existent et sont disponibles
    // const camion = await camionRepository.findOne({ where: { id: affecterDto.camionId } });
    // const chauffeur = await chauffeurRepository.findOne({ where: { id: affecterDto.chauffeurId } });
    // if (!camion || !chauffeur) { return error; }
    // if (!camion.estDisponible) { return error; }

    // Affecter le camion et le chauffeur
    // mission.camionId = affecterDto.camionId;
    // mission.chauffeurId = affecterDto.chauffeurId;
    mission.statut = StatutMission.EN_COURS;
    mission.affectationAutomatique = false;
    mission.dateDebutIntervention = new Date();

    // TODO: Calculer le temps estimé et la distance
    // mission.tempsEstimeArriveeMinutes = calculerTempsEstime(...);
    // mission.distanceKm = calculerDistance(...);

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Camion et chauffeur affectés manuellement avec succès !',
      data: updated,
    };
  }

  /**
   * Changer le statut de la mission
   */
  async changerStatut(id: string, nouveauStatut: StatutMission): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    const ancienStatut = mission.statut;
    mission.statut = nouveauStatut;

    // Mettre à jour les dates selon le statut
    if (nouveauStatut === StatutMission.EN_COURS && !mission.dateDebutIntervention) {
      mission.dateDebutIntervention = new Date();
    }

    if (nouveauStatut === StatutMission.TERMINEE) {
      mission.dateFinIntervention = new Date();
    }

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: `✅ Statut changé de ${ancienStatut} à ${nouveauStatut}`,
      data: updated,
    };
  }

  /**
   * Mettre à jour une mission
   */
  async update(id: string, updateMissionSOSDto: UpdateMissionSoDto): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    Object.assign(mission, updateMissionSOSDto);
    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Mission mise à jour avec succès !',
      data: updated,
    };
  }

  /**
   * Terminer une mission avec notes du chauffeur
   */
  async terminerMission(id: string, notesChauffeur?: string, coutIntervention?: number): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    mission.statut = StatutMission.TERMINEE;
    mission.dateFinIntervention = new Date();
    
    if (notesChauffeur) {
      mission.notesChauffeur = notesChauffeur;
    }
    
    if (coutIntervention !== undefined) {
      mission.coutIntervention = coutIntervention;
    }

    // TODO: Remettre le camion comme disponible
    // if (mission.camionId) {
    //   await camionRepository.update(mission.camionId, { estDisponible: true });
    // }

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Mission terminée avec succès !',
      data: updated,
    };
  }

  /**
   * Evaluer une mission (note du client)
   */
  async evaluerMission(id: string, evaluation: number, commentaire?: string): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    if (mission.statut !== StatutMission.TERMINEE) {
      return {
        success: false,
        message: '❌ Vous pouvez seulement évaluer une mission terminée',
      };
    }

    mission.evaluation = evaluation;
    
    if (commentaire) {
      mission.commentaireClient = commentaire;
    }

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Merci pour votre évaluation !',
      data: updated,
    };
  }

  /**
   * Annuler une mission
   */
  async annulerMission(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    if (mission.statut === StatutMission.TERMINEE) {
      return {
        success: false,
        message: '❌ Impossible d\'annuler une mission déjà terminée',
      };
    }

    mission.statut = StatutMission.ANNULEE;

    // TODO: Remettre le camion comme disponible si un camion était affecté
    // if (mission.camionId) {
    //   await camionRepository.update(mission.camionId, { estDisponible: true });
    // }

    const updated = await this.missionRepository.save(mission);

    return {
      success: true,
      message: '✅ Mission annulée',
      data: updated,
    };
  }

  /**
   * Supprimer une mission
   */
  async remove(id: string): Promise<any> {
    const mission = await this.missionRepository.findOne({ where: { id } });

    if (!mission) {
      return {
        success: false,
        message: `❌ Mission avec l'ID ${id} non trouvée`,
      };
    }

    await this.missionRepository.remove(mission);

    return {
      success: true,
      message: '✅ Mission supprimée avec succès !',
      deletedId: id,
    };
  }

  /**
   * Obtenir les statistiques des missions
   */
  async getStatistiques(): Promise<any> {
    const total = await this.missionRepository.count();
    const enAttente = await this.missionRepository.count({ where: { statut: StatutMission.EN_ATTENTE } });
    const enCours = await this.missionRepository.count({ where: { statut: StatutMission.EN_COURS } });
    const terminees = await this.missionRepository.count({ where: { statut: StatutMission.TERMINEE } });
    const annulees = await this.missionRepository.count({ where: { statut: StatutMission.ANNULEE } });

    // Calculer le coût total et l'évaluation moyenne
    const missionsTerminees = await this.missionRepository.find({
      where: { statut: StatutMission.TERMINEE },
    });

    const coutTotal = missionsTerminees.reduce((sum, m) => sum + (Number(m.coutIntervention) || 0), 0);
    const evaluations = missionsTerminees.filter(m => m.evaluation).map(m => m.evaluation);
    const evaluationMoyenne = evaluations.length > 0
      ? (evaluations.reduce((sum, e) => sum + e, 0) / evaluations.length).toFixed(2)
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
        tauxReussite: total > 0 ? ((terminees / total) * 100).toFixed(2) + '%' : '0%',
      },
    };
  }
}