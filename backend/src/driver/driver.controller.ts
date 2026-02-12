import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto, UpdateDriverStatusDto } from './dto/update-driver.dto';
import { DriversService } from './driver.service';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    /**
     * POST /drivers
     * Créer un nouveau chauffeur
     */
    @Post()
    create(@Body() createDriverDto: CreateDriverDto) {
        return this.driversService.create(createDriverDto);
    }

    /**
     * GET /drivers
     * Liste de tous les chauffeurs
     */
    @Get()
    findAll() {
        return this.driversService.findAll();
    }

    /**
     * GET /drivers/:id
     * Détails d'un chauffeur
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.driversService.findOne(id);
    }

    /**
     * PATCH /drivers/:id
     * Modifier un chauffeur
     */
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDriverDto: UpdateDriverDto,
    ) {
        return this.driversService.update(id, updateDriverDto);
    }

    /**
     * DELETE /drivers/:id
     * Supprimer un chauffeur
     */
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.driversService.remove(id);
    }

    /**
     * POST /drivers/:id/renew-token
     * Renouveler le token sécurisé
     */
    // @Post(':id/renew-token')
    // renewToken(@Param('id', ParseIntPipe) id: number) {
    //     return this.driversService.renewToken(id);
    // }

    /**
     * GET /drivers/status/:token
     * Voir le statut via le token sécurisé
     */
    // @Get('status/:token')
    // getDriverByToken(@Param('token') token: string) {
    //     return this.driversService.findByToken(token);
    // }

    /**
     * POST /drivers/status/:token
     * Modifier le statut via le token sécurisé
     */
    // @Post('status/:token')
    // updateStatus(
    //     @Param('token') token: string,
    //     @Body() updateStatusDto: UpdateDriverStatusDto,
    // ) {
    //     return this.driversService.updateStatus(token, updateStatusDto.status);
    // }
}