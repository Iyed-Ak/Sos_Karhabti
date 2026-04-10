import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  StatutNotification,
  TypeNotification,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // ============================================================
  // CRÉER UNE NOTIFICATION
  // ============================================================

  async create(createNotificationDto: CreateNotificationDto): Promise<any> {
    const notification = this.notificationRepository.create(createNotificationDto);
    const saved = await this.notificationRepository.save(notification);

    return {
      success: true,
      message: '✅ Notification créée avec succès',
      data: saved,
    };
  }

  // Méthode utilitaire pour créer rapidement une notification depuis d'autres services
  async envoyerNotification(
    userId: number,
    type: TypeNotification,
    titre: string,
    message: string,
    referenceId?: string,
    referenceType?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      titre,
      message,
      referenceId,
      referenceType,
      statut: StatutNotification.NON_LUE,
    });
    return this.notificationRepository.save(notification);
  }

  // ============================================================
  // RÉCUPÉRER LES NOTIFICATIONS D'UN UTILISATEUR
  // ============================================================

  async findByUser(userId: number): Promise<any> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      message: `📋 ${notifications.length} notification(s) trouvée(s)`,
      count: notifications.length,
      data: notifications,
    };
  }

  async findNonLuesByUser(userId: number): Promise<any> {
    const notifications = await this.notificationRepository.find({
      where: { userId, statut: StatutNotification.NON_LUE },
      order: { dateCreation: 'DESC' },
    });

    return {
      success: true,
      message: `🔔 ${notifications.length} notification(s) non lue(s)`,
      count: notifications.length,
      data: notifications,
    };
  }

  async compterNonLues(userId: number): Promise<any> {
    const count = await this.notificationRepository.count({
      where: { userId, statut: StatutNotification.NON_LUE },
    });

    return {
      success: true,
      nonLues: count,
    };
  }

  // ============================================================
  // MARQUER COMME LUE
  // ============================================================

  async marquerCommeLue(id: number): Promise<any> {
    const notification = await this.notificationRepository.findOne({ where: { id } });

    if (!notification) {
      return {
        success: false,
        message: `❌ Notification avec l'ID ${id} non trouvée`,
      };
    }

    notification.statut = StatutNotification.LUE;
    notification.dateLecture = new Date();
    const updated = await this.notificationRepository.save(notification);

    return {
      success: true,
      message: '✅ Notification marquée comme lue',
      data: updated,
    };
  }

  async marquerToutesCommeLues(userId: number): Promise<any> {
    await this.notificationRepository.update(
      { userId, statut: StatutNotification.NON_LUE },
      { statut: StatutNotification.LUE, dateLecture: new Date() },
    );

    return {
      success: true,
      message: '✅ Toutes les notifications marquées comme lues',
    };
  }

  // ============================================================
  // ARCHIVER / SUPPRIMER
  // ============================================================

  async archiver(id: number): Promise<any> {
    const notification = await this.notificationRepository.findOne({ where: { id } });

    if (!notification) {
      return {
        success: false,
        message: `❌ Notification avec l'ID ${id} non trouvée`,
      };
    }

    notification.statut = StatutNotification.ARCHIVEE;
    const updated = await this.notificationRepository.save(notification);

    return {
      success: true,
      message: '✅ Notification archivée',
      data: updated,
    };
  }

  async supprimerToutesLues(userId: number): Promise<any> {
    await this.notificationRepository.delete({
      userId,
      statut: StatutNotification.LUE,
    });

    return {
      success: true,
      message: '✅ Toutes les notifications lues supprimées',
    };
  }

  async remove(id: number): Promise<any> {
    const notification = await this.notificationRepository.findOne({ where: { id } });

    if (!notification) {
      return {
        success: false,
        message: `❌ Notification avec l'ID ${id} non trouvée`,
      };
    }

    await this.notificationRepository.remove(notification);

    return {
      success: true,
      message: '✅ Notification supprimée',
      deletedId: id,
    };
  }

  // ============================================================
  // ADMIN - TOUTES LES NOTIFICATIONS
  // ============================================================

  async findAll(): Promise<any> {
    const notifications = await this.notificationRepository.find({
      order: { dateCreation: 'DESC' },
      // Relations à activer quand prêt:
      // relations: ['utilisateur'],
    });

    return {
      success: true,
      message: `📋 ${notifications.length} notification(s) au total`,
      count: notifications.length,
      data: notifications,
    };
  }
}