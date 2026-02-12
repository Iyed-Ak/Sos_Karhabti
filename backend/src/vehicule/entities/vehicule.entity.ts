import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    




}
