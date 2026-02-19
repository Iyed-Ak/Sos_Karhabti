import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeEntretien {
    VIDANGE = 'VIDANGE',
    FILTRES = 'FILTRES',
    PNEUS = 'PNEUS',
    FREINS = 'FREINS',
    BATTERIE = 'BATTERIE',
    CLIMATISATION = 'CLIMATISATION',
    AUTRE = 'AUTRE',
}

@Entity("entretien")
export class Entretien {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: TypeEntretien,
    })
    type: TypeEntretien;

    @Column({ type: 'date' })
    datePrevue: Date;

    @Column({ type: 'date', nullable: true })
    dateRealisee: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    cout: number;

    @Column({ nullable: true })
    kilometragePrevu: number;

    @Column({ nullable: true })
    kilometrageRealise: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    estRealise: boolean;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ type: 'timestamp' })
    dateCreation: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    dateModification: Date;

    
    @ManyToOne(() => Vehicule, vehicule => vehicule.entretiens, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'vehiculeId' })
    vehicule: Vehicule;

}