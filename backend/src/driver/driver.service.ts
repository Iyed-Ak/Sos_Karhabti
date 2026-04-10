import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverStatus } from './entities/driver.entity';
import { Camion } from '../camion/entities/camion.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,

    @InjectRepository(Camion)
    private camionRepository: Repository<Camion>,
  ) {}

  async create(createDriverDto: CreateDriverDto) {
    const existing = await this.driverRepository.findOne({
      where: { email: createDriverDto.email },
    });

    if (existing) {
      return {
        success: false,
        message: '❌ Un chauffeur avec cet email existe déjà',
      };
    }

    const driver = this.driverRepository.create({
      ...createDriverDto,
      role: 'drivers',
    });

    const saved = await this.driverRepository.save(driver);

    return {
      success: true,
      message: '✅ Chauffeur créé avec succès',
      data: saved,
    };
  }

  async findAll() {
    const drivers = await this.driverRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['camionAssigne'],
    });

    return {
      success: true,
      message: `📋 ${drivers.length} chauffeur(s) trouvé(s)`,
      count: drivers.length,
      data: drivers,
    };
  }

  async findOne(id: number) {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['camionAssigne', 'missions'],
    });

    if (!driver) {
      return {
        success: false,
        message: `❌ Chauffeur avec l'ID ${id} non trouvé`,
      };
    }

    return {
      success: true,
      message: '✅ Chauffeur trouvé',
      data: driver,
    };
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      return {
        success: false,
        message: `❌ Chauffeur avec l'ID ${id} non trouvé`,
      };
    }

    if (updateDriverDto.name) driver.name = updateDriverDto.name;
    if (updateDriverDto.email) driver.email = updateDriverDto.email;
    if (updateDriverDto.phone) driver.phone = updateDriverDto.phone;
    if (updateDriverDto.status) {
      driver.statusDriver = updateDriverDto.status;
      driver.statusUpdatedAt = new Date();
    }

    const updated = await this.driverRepository.save(driver);

    return {
      success: true,
      message: '✅ Chauffeur mis à jour avec succès',
      data: updated,
    };
  }

  async remove(id: number) {
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

  // Assigner un camion à un chauffeur
  async assignerCamion(driverId: number, camionId: number) {
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
      relations: ['camionAssigne'],
    });

    if (!driver) {
      return { success: false, message: `❌ Chauffeur ${driverId} non trouvé` };
    }

    const camion = await this.camionRepository.findOne({
      where: { id: camionId },
      relations: ['chauffeur'],
    });

    if (!camion) {
      return { success: false, message: `❌ Camion ${camionId} non trouvé` };
    }

    // Vérifier que le camion n'a pas déjà un chauffeur différent
    if (camion.chauffeur && camion.chauffeur.id !== driverId) {
      return {
        success: false,
        message: `❌ Ce camion est déjà assigné au chauffeur #${camion.chauffeur.id}`,
      };
    }

    // Affecter la relation
    driver.camionAssigne = camion;
    driver.statusDriver = DriverStatus.DISPONIBLE;
    const updated = await this.driverRepository.save(driver);

    return {
      success: true,
      message: `✅ Camion #${camionId} assigné au chauffeur #${driverId}`,
      data: updated,
    };
  }

  // Retirer l'assignation d'un camion
  async retirerCamion(driverId: number) {
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
      relations: ['camionAssigne'],
    });

    if (!driver) {
      return { success: false, message: `❌ Chauffeur ${driverId} non trouvé` };
    }

    driver.camionAssigne = null;
    const updated = await this.driverRepository.save(driver);

    return {
      success: true,
      message: '✅ Assignation retirée avec succès',
      data: updated,
    };
  }

  // Récupérer le camion assigné à un chauffeur
  async getCamionAssigne(driverId: number) {
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
      relations: ['camionAssigne', 'camionAssigne.plagesHoraires'],
    });

    if (!driver) {
      return { success: false, message: `❌ Chauffeur ${driverId} non trouvé` };
    }

    if (!driver.camionAssigne) {
      return {
        success: false,
        message: '📭 Aucun camion assigné à ce chauffeur',
      };
    }

    return {
      success: true,
      message: '✅ Camion assigné trouvé',
      data: driver.camionAssigne,
    };
  }

  // Récupérer les missions d'un chauffeur
  async getMissions(driverId: number) {
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
      relations: ['missions', 'missions.vehicule', 'missions.client', 'missions.camion'],
    });

    if (!driver) {
      return { success: false, message: `❌ Chauffeur ${driverId} non trouvé` };
    }

    return {
      success: true,
      message: `📋 ${driver.missions?.length || 0} mission(s) trouvée(s)`,
      count: driver.missions?.length || 0,
      data: driver.missions,
    };
  }
}