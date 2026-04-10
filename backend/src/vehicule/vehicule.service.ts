import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { Client } from '../client/entities/client.entity';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createVehiculeDto: CreateVehiculeDto): Promise<any> {
    // Vérifier que le client existe
    const client = await this.clientRepository.findOne({
      where: { id: createVehiculeDto.userId },
    });

    if (!client) {
      return {
        success: false,
        message: `❌ Client avec l'ID ${createVehiculeDto.userId} non trouvé`,
      };
    }

    const vehicule = this.vehiculeRepository.create({
      ...createVehiculeDto,
      client: client,
    });

    const saved = await this.vehiculeRepository.save(vehicule);

    // Mettre à jour le compteur de véhicules du client
    client.nombreVehicules = (client.nombreVehicules || 0) + 1;
    await this.clientRepository.save(client);

    return {
      success: true,
      message: '✅ Véhicule ajouté avec succès !',
      data: saved,
    };
  }

  async findAll(): Promise<any> {
    const vehicules = await this.vehiculeRepository.find({
      order: { dateCreation: 'DESC' },
      relations: ['client'],
    });

    return {
      success: true,
      message: `📋 ${vehicules.length} véhicule(s) trouvé(s)`,
      count: vehicules.length,
      data: vehicules,
    };
  }

  async findOne(id: number): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      relations: ['client', 'entretiens', 'missions'],
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

  async findByUser(userId: number): Promise<any> {
    const vehicules = await this.vehiculeRepository.find({
      where: { client: { id: userId } },
      order: { dateCreation: 'DESC' },
      relations: ['client', 'entretiens'],
    });

    return {
      success: true,
      message: `📋 ${vehicules.length} véhicule(s) pour le client #${userId}`,
      count: vehicules.length,
      data: vehicules,
    };
  }

  async findByPlaque(plaque: string): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { plaqueImmatriculation: plaque },
      relations: ['client', 'entretiens'],
    });

    if (!vehicule) {
      throw new NotFoundException(
        `❌ Véhicule avec la plaque ${plaque} non trouvé`,
      );
    }

    return {
      success: true,
      message: '✅ Véhicule trouvé',
      data: vehicule,
    };
  }

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

  async remove(id: number): Promise<any> {
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!vehicule) {
      throw new NotFoundException(`❌ Véhicule avec l'ID ${id} non trouvé`);
    }

    // Décrémenter le compteur de véhicules du client
    if (vehicule.client) {
      vehicule.client.nombreVehicules = Math.max(
        0,
        (vehicule.client.nombreVehicules || 1) - 1,
      );
      await this.clientRepository.save(vehicule.client);
    }

    await this.vehiculeRepository.remove(vehicule);

    return {
      success: true,
      message: '✅ Véhicule supprimé avec succès !',
      deletedId: id,
    };
  }

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