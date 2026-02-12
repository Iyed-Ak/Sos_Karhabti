import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
    ) { }

    async create(createClientDto: CreateClientDto) {
        // Vérifier si l'email existe déjà
        const existingClient = await this.clientRepository.findOne({ 
            where: { email: createClientDto.email } 
        });

        if (existingClient) {
            return {
                success: false,
                message: '❌ Un client avec cet email existe déjà',
            };
        }

        // Créer le client avec role 'clients'
        const client = this.clientRepository.create({
            ...createClientDto,
            role: 'clients'
        });

        const savedClient = await this.clientRepository.save(client);

        return {
            success: true,
            message: '✅ Client créé avec succès',
            data: savedClient,
        };
    }

    async findAll() {
        const clients = await this.clientRepository.find({
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: `📋 ${clients.length} client(s) trouvé(s)`,
            count: clients.length,
            data: clients,
        };
    }

    async findOne(id: number) {
        const client = await this.clientRepository.findOne({ where: { id } });

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

    async update(id: number, updateClientDto: UpdateClientDto) {
        const client = await this.clientRepository.findOne({ where: { id } });

        if (!client) {
            return {
                success: false,
                message: `❌ Client avec l'ID ${id} non trouvé`,
            };
        }

        // Mettre à jour les champs
        Object.assign(client, updateClientDto);

        const updated = await this.clientRepository.save(client);

        return {
            success: true,
            message: '✅ Client mis à jour avec succès',
            data: updated,
        };
    }

    async remove(id: number) {
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

}