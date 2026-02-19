import { Client } from "src/client/entities/client.entity";
import { Entretien } from "src/entretien/entities/entretien.entity";
import { MissionSOS } from "src/mission-sos/entities/mission-so.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("vehicule")
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

    @Column()
    plaqueImmatriculation: string;

    @Column()
    vin: string;

    @Column()
    dateAcquisition: Date;

    @Column()
    typeCarburant: string;

    @Column()
    couleur: string;

   

    // @Column()
    // userId: number;

    @CreateDateColumn()
    dateCreation: Date;

    @UpdateDateColumn()
    dateModification: Date;

    @Column()
    image:string

    @ManyToOne(() => Client, client => client.vehicules,{
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    client: Client;
    

    @OneToMany(() => Entretien, entretien => entretien.vehicule)
    entretiens: Entretien[];


    @OneToMany(() => MissionSOS, (mission) => mission.vehicule, {
        cascade: false,
        eager: false
    })
    missions: MissionSOS[];
    




}
