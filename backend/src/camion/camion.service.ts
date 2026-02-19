import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Camion } from './entities/camion.entity';
import { CreateCamionDto } from './dto/create-camion.dto';
import { UpdateCamionDto } from './dto/update-camion.dto';
import { Driver } from 'src/driver/entities/driver.entity';

@Injectable()
export class CamionService {
  constructor(
    @InjectRepository(Camion)

    private camionRepository: Repository<Camion>, 
  ) {}

  /**
   * Créer un nouveau camion
   */
  async create(createCamionDto: CreateCamionDto): Promise<any> {
    // Vérifier si l'immatriculation existe déjà
    const existingCamion = await this.camionRepository.findOne({
      where: { immatriculation: createCamionDto.immatriculation }
    });

    if (existingCamion) {
      return {
        success: false,
        message: '❌ Un camion avec cette immatriculation existe déjà',
      };
    }

    const camion = this.camionRepository.create(createCamionDto as DeepPartial<Camion>);
    const saved = await this.camionRepository.save(camion);
    
    return {
      success: true,
      message: '✅ Camion ajouté avec succès !',
      data: saved,
    };
  }

  /**
   * Récupérer tous les camions
   */
  async findAll(): Promise<any> {
    const camions = await this.camionRepository.find({
      order: { dateCreation: 'DESC' },
      // Relations à ajouter plus tard:
      // relations: ['chauffeur', 'missions', 'plagesHoraires'],
    });

    return {
      success: true,
      message: `📋 ${camions.length} camion(s) trouvé(s)`,
      count: camions.length,
      data: camions,
    };
  }

  /**
   * Récupérer un camion par son ID
   */
  async findOne(id: number): Promise<any> {
    const camion = await this.camionRepository.findOne({
      where: { id },
      // Relations à ajouter plus tard:
      // relations: ['chauffeur', 'missions', 'plagesHoraires'],
    });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'ID ${id} non trouvé`,
      };
    }

    return {
      success: true,
      message: '✅ Camion trouvé',
      data: camion,
    };
  }

  /**
   * Rechercher un camion par son immatriculation
   */
  async findByImmatriculation(immatriculation: string): Promise<any> {
    const camion = await this.camionRepository.findOne({
      where: { immatriculation },
      // Relations à ajouter plus tard:
      // relations: ['chauffeur', 'missions'],
    });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'immatriculation ${immatriculation} non trouvé`,
      };
    }

    return {
      success: true,
      message: '✅ Camion trouvé',
      data: camion,
    };
  }

  /**
   * Récupérer tous les camions disponibles
   */
  async findDisponibles(): Promise<any> {
    const camions = await this.camionRepository.find({
      where: { estDisponible: true },
      order: { dateCreation: 'DESC' },
      // Relations à ajouter plus tard:
      // relations: ['chauffeur'],
    });

    return {
      success: true,
      message: `📋 ${camions.length} camion(s) disponible(s)`,
      count: camions.length,
      data: camions,
    };
  }

  /**
   * Mettre à jour un camion
   */
  async update(id: number, updateCamionDto: UpdateCamionDto): Promise<any> {
    const camion = await this.camionRepository.findOne({ where: { id } });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'ID ${id} non trouvé`,
      };
    }

    Object.assign(camion, updateCamionDto);
    const updated = await this.camionRepository.save(camion);

    return {
      success: true,
      message: '✅ Camion mis à jour avec succès !',
      data: updated,
    };
  }

  /**
   * Supprimer un camion
   */
  async remove(id: number): Promise<any> {
    const camion = await this.camionRepository.findOne({ where: { id } });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'ID ${id} non trouvé`,
      };
    }

    await this.camionRepository.remove(camion);

    return {
      success: true,
      message: '✅ Camion supprimé avec succès !',
      deletedId: id,
    };
  }

  /**
   * Mettre à jour le kilométrage d'un camion
   */
  async updateKilometrage(id: number, nouveauKm: number): Promise<any> {
    const camion = await this.camionRepository.findOne({ where: { id } });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'ID ${id} non trouvé`,
      };
    }

    const ancienKm = camion.kilometrageActuel;
    camion.kilometrageActuel = nouveauKm;
    const updated = await this.camionRepository.save(camion);

    return {
      success: true,
      message: '✅ Kilométrage mis à jour avec succès !',
      ancienKilometrage: ancienKm,
      nouveauKilometrage: nouveauKm,
      data: updated,
    };
  }

  /**
   * Changer la disponibilité d'un camion
   */
  async changerDisponibilite(id: number, estDisponible: boolean): Promise<any> {
    const camion = await this.camionRepository.findOne({ where: { id } });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'ID ${id} non trouvé`,
      };
    }

    camion.estDisponible = estDisponible;
    const updated = await this.camionRepository.save(camion);

    return {
      success: true,
      message: `✅ Camion ${estDisponible ? 'disponible' : 'indisponible'}`,
      data: updated,
    };
  }

  /**
   * Mettre à jour le planning horaire
   */
  async mettreAJourPlanning(id: number, planningHoraire: string): Promise<any> {
    const camion = await this.camionRepository.findOne({ where: { id } });

    if (!camion) {
      return {
        success: false,
        message: `❌ Camion avec l'ID ${id} non trouvé`,
      };
    }

    camion.planningHoraire = planningHoraire;
    const updated = await this.camionRepository.save(camion);

    return {
      success: true,
      message: '✅ Planning mis à jour avec succès !',
      data: updated,
    };
  }

  /**
   * Assigner un chauffeur à un camion
   */
  // async assignerChauffeur(camionId: number, chauffeurId: number): Promise<any> {
  //   const camion = await this.camionRepository.findOne({ where: { id: camionId } });

  //   if (!camion) {
  //     return {
  //       success: false,
  //       message: `❌ Camion avec l'ID ${camionId} non trouvé`,
  //     };
  //   }

  //   // TODO: Vérifier que le chauffeur existe et n'est pas déjà assigné à un autre camion
  //   // const chauffeur = await chauffeurRepository.findOne({ where: { id: chauffeurId } });
  //   // if (!chauffeur) {
  //   //   return { success: false, message: '❌ Chauffeur non trouvé' };
  //   // }
  //   // const autreCamion = await this.camionRepository.findOne({ where: { currentDriverId: chauffeurId } });
  //   // if (autreCamion) {
  //   //   return { success: false, message: '❌ Ce chauffeur est déjà assigné à un autre camion' };
  //   // }

  //   camion.currentDriverId = chauffeurId;
  //   const updated = await this.camionRepository.save(camion);

  //   return {
  //     success: true,
  //     message: '✅ Chauffeur assigné au camion avec succès !',
  //     data: updated,
  //   };
  // }

  /**
   * Retirer le chauffeur d'un camion
   */
  // async retirerChauffeur(camionId: number): Promise<any> {
  //   const camion = await this.camionRepository.findOne({ where: { id: camionId } });

  //   if (!camion) {
  //     return {
  //       success: false,
  //       message: `❌ Camion avec l'ID ${camionId} non trouvé`,
  //     };
  //   }

  //   if (!camion.currentDriverId) {
  //     return {
  //       success: false,
  //       message: '❌ Aucun chauffeur assigné à ce camion',
  //     };
  //   }

  //   camion.currentDriverId = null;
  //   const updated = await this.camionRepository.save(camion);

  //   return {
  //     success: true,
  //     message: '✅ Chauffeur retiré du camion avec succès !',
  //     data: updated,
  //   };
  // }

  /**
   * Récupérer tous les camions avec leur chauffeur actuel
   */
  // async findAllWithDriver(): Promise<any> {
  //   const camions = await this.camionRepository.find({
  //     order: { dateCreation: 'DESC' },
  //     // Relations à ajouter plus tard:
  //     // relations: ['currentDriver'],
  //   });

  //   return {
  //     success: true,
  //     message: `📋 ${camions.length} camion(s) trouvé(s)`,
  //     count: camions.length,
  //     data: camions,
  //   };
  // }
}