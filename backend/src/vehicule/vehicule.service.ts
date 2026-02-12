import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,
  ) {}

  /**
   * Créer un nouveau véhicule
   * @param createVehiculeDto - Données du véhicule à créer
   * @returns Le véhicule créé avec un message de succès
   */
  async create(createVehiculeDto: CreateVehiculeDto): Promise<any> {
    const vehicule = this.vehiculeRepository.create(createVehiculeDto);
    const saved = await this.vehiculeRepository.save(vehicule);
    
    return {
      success: true,
      message: '✅ Véhicule ajouté avec succès !',
      data: saved,
    };
  }

  /**
   * Récupérer tous les véhicules
   * @returns Liste de tous les véhicules
   */
  async findAll(): Promise<any> {
    const vehicules = await this.vehiculeRepository.find({
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      message: `📋 ${vehicules.length} véhicule(s) trouvé(s)`,
      count: vehicules.length,
      data: vehicules,
    };
  }

  /**
   * Récupérer un véhicule par son ID
   * @param id - L'ID du véhicule
   * @returns Le véhicule trouvé
   */
  async findOne(id: number): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
    });

    if (!vehicule) {
      throw new NotFoundException(`❌ Véhicule avec l'ID ${id} non trouvé`);
    }

    return {
      success: true,
      message: '✅ Véhicule trouvé',
      data: vehicule,
    };
  }

  /**
   * Récupérer tous les véhicules d'un utilisateur
   * @param userId - L'ID de l'utilisateur
   * @returns Liste des véhicules de l'utilisateur
   */
  async findByUser(userId: number): Promise<any> {
    const vehicules = await this.vehiculeRepository.find({
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      message: `📋 ${vehicules.length} véhicule(s) trouvé(s) pour l'utilisateur #${userId}`,
      count: vehicules.length,
      data: vehicules,
    };
  }

  /**
   * Rechercher un véhicule par sa plaque d'immatriculation
   * @param plaque - La plaque d'immatriculation
   * @returns Le véhicule trouvé
   */
  async findByPlaque(plaque: string): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { plaqueImmatriculation: plaque },
    });

    if (!vehicule) {
      throw new NotFoundException(`❌ Véhicule avec la plaque ${plaque} non trouvé`);
    }

    return {
      success: true,
      message: '✅ Véhicule trouvé',
      data: vehicule,
    };
  }

  /**
   * Mettre à jour un véhicule
   * @param id - L'ID du véhicule
   * @param updateVehiculeDto - Nouvelles données du véhicule
   * @returns Le véhicule mis à jour
   */
  async update(id: number, updateVehiculeDto: UpdateVehiculeDto): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id } });

    if (!vehicule) {
      throw new NotFoundException(`❌ Véhicule avec l'ID ${id} non trouvé`);
    }

    Object.assign(vehicule, updateVehiculeDto);
    const updated = await this.vehiculeRepository.save(vehicule);

    return {
      success: true,
      message: '✅ Véhicule mis à jour avec succès !',
      data: updated,
    };
  }

  /**
   * Supprimer un véhicule
   * @param id - L'ID du véhicule à supprimer
   * @returns Message de confirmation
   */
  async remove(id: number): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id } });

    if (!vehicule) {
      throw new NotFoundException(`❌ Véhicule avec l'ID ${id} non trouvé`);
    }

    await this.vehiculeRepository.remove(vehicule);

    return {
      success: true,
      message: '✅ Véhicule supprimé avec succès !',
      deletedId: id,
    };
  }

  /**
   * Mettre à jour le kilométrage d'un véhicule
   * @param id - L'ID du véhicule
   * @param nouveauKm - Nouveau kilométrage
   * @returns Le véhicule avec le kilométrage mis à jour
   */
  async updateKilometrage(id: number, nouveauKm: number): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id } });

    if (!vehicule) {
      throw new NotFoundException(`❌ Véhicule avec l'ID ${id} non trouvé`);
    }

    const ancienKm = vehicule.kilometrageActuel;
    vehicule.kilometrageActuel = nouveauKm;
    const updated = await this.vehiculeRepository.save(vehicule);

    return {
      success: true,
      message: '✅ Kilométrage mis à jour avec succès !',
      ancienKilometrage: ancienKm,
      nouveauKilometrage: nouveauKm,
      data: updated,
    };
  }
}