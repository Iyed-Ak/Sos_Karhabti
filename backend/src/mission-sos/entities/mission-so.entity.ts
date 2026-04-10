import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Camion } from '../../camion/entities/camion.entity';
import { Client } from '../../client/entities/client.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';

export enum StatutMission {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
}

export enum TypePanne {
  PANNE_MOTEUR = 'PANNE_MOTEUR',
  PANNE_BATTERIE = 'PANNE_BATTERIE',
  PANNE_ESSENCE = 'PANNE_ESSENCE',
  CREVAISON = 'CREVAISON',
  ACCIDENT = 'ACCIDENT',
  PROBLEME_FREINS = 'PROBLEME_FREINS',
  SURCHAUFFE = 'SURCHAUFFE',
  PANNE_ELECTRIQUE = 'PANNE_ELECTRIQUE',
  AUTRE = 'AUTRE',
}

@Entity('mission_sos')
export class MissionSOS {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitudeGPS: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitudeGPS: number;

  @Column({ type: 'text', nullable: true })
  adresseManuelle: string;

  @Column({ type: 'enum', enum: TypePanne })
  typePanne: TypePanne;

  @Column({ type: 'text', nullable: true })
  descriptionPanne: string;

  @Column({
    type: 'enum',
    enum: StatutMission,
    default: StatutMission.EN_ATTENTE,
  })
  statut: StatutMission;

  @CreateDateColumn({ type: 'timestamp' })
  dateCreation: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateDebutIntervention: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateFinIntervention: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  dateModification: Date;

  @Column({ nullable: true })
  tempsEstimeArriveeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distanceKm: number;

  @Column({ default: false })
  affectationAutomatique: boolean;

  @Column({ type: 'text', nullable: true })
  notesChauffeur: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coutIntervention: number;

  @Column({ type: 'int', nullable: true })
  evaluation: number;

  @Column({ type: 'text', nullable: true })
  commentaireClient: string;

  // ─── RELATIONS ─────────────────────────────────────────────

  // Une mission est faite par un client
  @ManyToOne(() => Client, (client) => client.missions, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  // Une mission concerne un véhicule
  @ManyToOne(() => Vehicule, (vehicule) => vehicule.missions, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'vehiculeId' })
  vehicule: Vehicule;

  // Une mission est réalisée par un camion
  @ManyToOne(() => Camion, (camion) => camion.missions, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'camionId' })
  camion: Camion;

  // Une mission est réalisée par un chauffeur
  @ManyToOne(() => Driver, (driver) => driver.missions, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'chauffeurId' })
  chauffeur: Driver;
}