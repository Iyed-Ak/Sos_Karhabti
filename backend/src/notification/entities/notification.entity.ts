import {
  Column,CreateDateColumn,Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn,} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum TypeNotification {
  ENTRETIEN_RAPPEL = 'ENTRETIEN_RAPPEL',       // Rappel d'entretien à venir
  ENTRETIEN_DEPASSE = 'ENTRETIEN_DEPASSE',     // Entretien en retard
  MISSION_SOS_CREE = 'MISSION_SOS_CREE',       // Nouvelle mission SOS créée
  MISSION_SOS_AFFECTEE = 'MISSION_SOS_AFFECTEE', // Mission affectée à un camion
  MISSION_SOS_TERMINEE = 'MISSION_SOS_TERMINEE', // Mission terminée
  MISSION_SOS_ANNULEE = 'MISSION_SOS_ANNULEE',   // Mission annulée
  CAMION_DISPONIBLE = 'CAMION_DISPONIBLE',     // Camion redevenu disponible
  SYSTEME = 'SYSTEME',                          // Notification système générale
}

export enum StatutNotification {
  NON_LUE = 'NON_LUE',
  LUE = 'LUE',
  ARCHIVEE = 'ARCHIVEE',
}

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TypeNotification,
  })
  type: TypeNotification;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: StatutNotification,
    default: StatutNotification.NON_LUE,
  })
  statut: StatutNotification;

  // ID de référence (ex: ID de la mission, ID de l'entretien...)
  @Column({ nullable: true })
  referenceId: string;

  // Type de référence pour savoir à quoi appartient le referenceId
  @Column({ nullable: true })
  referenceType: string; // 'mission', 'entretien', 'vehicule', etc.

  @CreateDateColumn({ type: 'timestamp' })
  dateCreation: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateLecture: Date;

  // Relation avec l'utilisateur destinataire
  // Relation à activer quand prêt:
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  utilisateur: User;

  @Column({ nullable: true })
  userId: number;
}