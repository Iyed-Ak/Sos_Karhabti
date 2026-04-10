import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Camion } from 'src/camion/entities/camion.entity';

export enum JourSemaine {
  LUNDI = 'LUNDI',
  MARDI = 'MARDI',
  MERCREDI = 'MERCREDI',
  JEUDI = 'JEUDI',
  VENDREDI = 'VENDREDI',
  SAMEDI = 'SAMEDI',
  DIMANCHE = 'DIMANCHE',
}

@Entity('plage_horaire')
export class PlageHoraire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: JourSemaine,
  })
  jourSemaine: JourSemaine;

  @Column({ type: 'time' })
  heureDebut: string; // Format HH:MM

  @Column({ type: 'time' })
  heureFin: string; // Format HH:MM

  @Column({ default: true })
  estActif: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  dateCreation: Date;

  // Relation avec Camion
  // Relation à activer quand prêt:
  @ManyToOne(() => Camion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'camionId' })
  camion: Camion;

  @Column({ nullable: true })
  camionId: number;
}