import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';
import { MissionSOS } from '../../mission-sos/entities/mission-so.entity';
import { PlageHoraire } from '../../plage_horaire/entities/plage_horaire.entity';

@Entity('camion')
export class Camion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  immatriculation: string;

  @Column()
  marque: string;

  @Column()
  modele: string;

  @Column()
  capaciteRemorquage: number;

  @Column({ default: true })
  estDisponible: boolean;

  @Column({ type: 'text', nullable: true })
  planningHoraire?: string;

  @CreateDateColumn({ type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  dateModification: Date;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 0 })
  kilometrageActuel: number;

  @Column({ nullable: true })
  annee: number;

  @Column({ nullable: true })
  couleur: string;

  // ─── RELATIONS ─────────────────────────────────────────────

  // Un camion est conduit par un seul chauffeur (côté inverse)
  @OneToOne(() => Driver, (driver) => driver.camionAssigne, {
    nullable: true,
    eager: false,
  })
  chauffeur: Driver;

  // Un camion peut réaliser plusieurs missions
  @OneToMany(() => MissionSOS, (mission) => mission.camion, {
    cascade: false,
    eager: false,
  })
  missions: MissionSOS[];

  // Un camion a un planning horaire (plusieurs plages)
  @OneToMany(() => PlageHoraire, (plage) => plage.camion, {
    cascade: true,
    eager: false,
  })
  plagesHoraires: PlageHoraire[];
}