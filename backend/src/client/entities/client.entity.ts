import {
  ChildEntity,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { MissionSOS } from '../../mission-sos/entities/mission-so.entity';
// import { Notification } from '../../notification/entities/notification.entity';

@ChildEntity('client')
export class Client extends User {
  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: 0 })
  totalRequests: number;

  @Column({ default: 0 })
  nombreVehicules: number;

  @Column({ default: 0 })
  nombreMissionsSOS: number;

  // ─── RELATIONS ─────────────────────────────────────────────

  // Un client possède plusieurs véhicules
  @OneToMany(() => Vehicule, (vehicule) => vehicule.client, {
    cascade: true,
    eager: false,
  })
  vehicules: Vehicule[];

  // Un client peut avoir plusieurs missions SOS
  @OneToMany(() => MissionSOS, (mission) => mission.client, {
    cascade: false,
    eager: false,
  })
  missions: MissionSOS[];

//   // Un client reçoit des notifications
//   @OneToMany(() => Notification, (notification) => notification.utilisateur, {
//     cascade: false,
//     eager: false,
//   })
//   notifications: Notification[];
}