import {
  ChildEntity,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Camion } from '../../camion/entities/camion.entity';
import { MissionSOS } from '../../mission-sos/entities/mission-so.entity';
import { Notification } from '../../notification/entities/notification.entity';

export enum DriverStatus {
  DISPONIBLE = 'DISPONIBLE',
  EN_INTERVENTION = 'EN_INTERVENTION',
  HORS_SERVICE = 'HORS_SERVICE',
}

@ChildEntity('drivers')
export class Driver extends User {
  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.HORS_SERVICE,
  })
  statusDriver: DriverStatus;

  @Column({ type: 'timestamp', nullable: true })
  statusUpdatedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // ─── RELATIONS ─────────────────────────────────────────────

  // Un chauffeur est assigné à un seul camion (côté propriétaire avec JoinColumn)
  @OneToOne(() => Camion, (camion) => camion.chauffeur, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'camionAssigneId' })
  camionAssigne: Camion | null;

  // Un chauffeur peut réaliser plusieurs missions
  @OneToMany(() => MissionSOS, (mission) => mission.chauffeur, {
    cascade: false,
    eager: false,
  })
  missions: MissionSOS[];

  // Un chauffeur reçoit des notifications
  @OneToMany(() => Notification, (notification) => notification.utilisateur, {
    cascade: false,
    eager: false,
  })
  notifications: Notification[];
}