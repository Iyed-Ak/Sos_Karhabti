import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Entretien } from '../../entretien/entities/entretien.entity';
import { MissionSOS } from '../../mission-sos/entities/mission-so.entity';

@Entity('vehicule')
export class Vehicule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marque: string;

  @Column()
  modele: string;

  @Column()
  annee: number;

  @Column()
  kilometrageActuel: number;

  @Column({ unique: true })
  plaqueImmatriculation: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true, type: 'date' })
  dateAcquisition: Date;

  @Column()
  typeCarburant: string;

  @Column({ nullable: true })
  couleur: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ type: 'timestamp' })
  dateCreation: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  dateModification: Date;

  // ─── RELATIONS ─────────────────────────────────────────────

  // Un véhicule appartient à un client
  @ManyToOne(() => Client, (client) => client.vehicules, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  // Un véhicule peut avoir plusieurs entretiens
  @OneToMany(() => Entretien, (entretien) => entretien.vehicule, {
    cascade: true,
    eager: false,
  })
  entretiens: Entretien[];

  // Un véhicule peut être concerné par plusieurs missions SOS
  @OneToMany(() => MissionSOS, (mission) => mission.vehicule, {
    cascade: false,
    eager: false,
  })
  missions: MissionSOS[];
}