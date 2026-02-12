import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Response } from 'express';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Res() response) {
    try {
      const client = await this.clientService.create(createClientDto);
      return response.status(HttpStatus.CREATED).json({
        message: "client create avec succes",
        client
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la creation " + error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const client = await this.clientService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "this all clients",
        client,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur data not found " + error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try {
      const client = await this.clientService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "this client",
        client,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur client not found " + error.message,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
    @Res() response
  ) {
    try {
      const updatedClient = await this.clientService.update(id, updateClientDto);
      return response.status(HttpStatus.OK).json({
        message: "client updated with success",
        updatedClient
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la mise à jour " + error.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response) {
    try {
      const client = await this.clientService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "client deleted with success",
        client
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "erreur lors de la suppression " + error.message,
      });
    }
  }
}
