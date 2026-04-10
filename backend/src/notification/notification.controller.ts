import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // POST /notifications - Créer une notification
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto, @Res() response) {
    try {
      const result = await this.notificationService.create(createNotificationDto);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /notifications - Toutes les notifications (admin)
  @Get()
  async findAll(@Res() response) {
    try {
      const result = await this.notificationService.findAll();
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /notifications/user/:userId - Notifications d'un utilisateur
  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number, @Res() response) {
    try {
      const result = await this.notificationService.findByUser(userId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /notifications/user/:userId/non-lues - Notifications non lues
  @Get('user/:userId/non-lues')
  async findNonLues(@Param('userId', ParseIntPipe) userId: number, @Res() response) {
    try {
      const result = await this.notificationService.findNonLuesByUser(userId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // GET /notifications/user/:userId/count - Compter les non lues
  @Get('user/:userId/count')
  async compterNonLues(@Param('userId', ParseIntPipe) userId: number, @Res() response) {
    try {
      const result = await this.notificationService.compterNonLues(userId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // PATCH /notifications/:id/lue - Marquer une notification comme lue
  @Patch(':id/lue')
  async marquerCommeLue(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.notificationService.marquerCommeLue(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // PATCH /notifications/user/:userId/tout-lire - Marquer toutes comme lues
  @Patch('user/:userId/tout-lire')
  async marquerToutesCommeLues(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() response,
  ) {
    try {
      const result = await this.notificationService.marquerToutesCommeLues(userId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // PATCH /notifications/:id/archiver - Archiver une notification
  @Patch(':id/archiver')
  async archiver(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.notificationService.archiver(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // DELETE /notifications/user/:userId/vider - Supprimer les notifs lues
  @Delete('user/:userId/vider')
  async supprimerLues(@Param('userId', ParseIntPipe) userId: number, @Res() response) {
    try {
      const result = await this.notificationService.supprimerToutesLues(userId);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }

  // DELETE /notifications/:id - Supprimer une notification
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() response) {
    try {
      const result = await this.notificationService.remove(id);
      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Erreur: ' + error.message,
      });
    }
  }
}