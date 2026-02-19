import { Driver } from "src/driver/entities/driver.entity";
import { MissionSOS } from "src/mission-sos/entities/mission-so.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("camion")
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

    @Column({ type: 'text', nullable: true })
    planningHoraire: string; // JSON string pour stocker les plages horaires

    @Column({ default: true })
    estDisponible: boolean;

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

    

    @OneToOne(() => Driver, driver => driver.camionAssigne)
    currentDriverId: Driver;

    
    // @ManyToOne(() => Admin, admin => admin.camions)
    // admin: Admin;

    // @ManyToOne(() => Driver, driver => driver.camionAssigne)
    // currentDriver: Driver;

    @OneToMany(() => MissionSOS, mission => mission.camion)
    missions: MissionSOS[];

    // @OneToMany(() => PlageHoraire, plage => plage.camion)
    // plagesHoraires: PlageHoraire[];
}