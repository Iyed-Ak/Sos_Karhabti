import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Driver, DriverStatus } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private driverRepository: Repository<Driver>,
    
    ) { }

    async create(createDriverDto: CreateDriverDto)  {
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await this.driverRepository.findOne({ where: { email: createDriverDto.email } });
        if (existingUser) {
            return {
                success: false,
                message: '❌ Un chauffeur avec cet email existe déjà',
            };
        }


        // Créer l'utilisateur
        const driver = this.driverRepository.create({...createDriverDto , role: 'drivers'});

        const savedDriver = await this.driverRepository.save(driver);

      

        return savedDriver;


    }

    async findAll() {
        const drivers = await this.driverRepository.find({
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: `📋 ${drivers.length} chauffeur(s) trouvé(s)`,
            count: drivers.length,
            data: drivers,
        };
    }

    async findOne(id: number) {
        const driver = await this.driverRepository.findOne({ where: { id } });

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

        // Mettre à jour les champs
        if (updateDriverDto.name) driver.name = updateDriverDto.name;
        if (updateDriverDto.email) driver.email = updateDriverDto.email;
        if (updateDriverDto.phone) driver.phone = updateDriverDto.phone;
        if (updateDriverDto.status) {
            driver.status = updateDriverDto.status;
            driver.statusUpdatedAt = new Date();
        }

        const updated = await this.driverRepository.save(driver);

        return {
            success: true,
            message: '✅ Chauffeur mis à jour avec succès',
            data: updated,
        };
    }

    // async updateStatus(token: string, status: DriverStatus) {
    //     const result = await this.findByToken(token);

    //     if (!result.success) {
    //         return result;
    //     }

    //     const driver = result.data;
    //     driver.status = status;
    //     driver.statusUpdatedAt = new Date();

    //     const updated = await this.driverRepository.save(driver);

    //     return {
    //         success: true,
    //         message: `✅ Statut changé en "${status}"`,
    //         data: {
    //             name: updated.name,
    //             status: updated.status,
    //             statusUpdatedAt: updated.statusUpdatedAt,
    //         },
    //     };
    // }

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

    // async renewToken(id: number) {
    //     const driver = await this.driverRepository.findOne({ where: { id } });

    //     if (!driver) {
    //         return {
    //             success: false,
    //             message: `❌ Chauffeur avec l'ID ${id} non trouvé`,
    //         };
    //     }

    //     driver.secureToken = randomBytes(32).toString('hex');
    //     driver.tokenExpiresAt = new Date();
    //     driver.tokenExpiresAt.setDate(driver.tokenExpiresAt.getDate() + 30);

    //     const updated = await this.driverRepository.save(driver);

    //     return {
    //         success: true,
    //         message: '✅ Token renouvelé',
    //         data: {
    //             secureToken: updated.secureToken,
    //             tokenExpiresAt: updated.tokenExpiresAt,
    //         },
    //     };
    // }
}