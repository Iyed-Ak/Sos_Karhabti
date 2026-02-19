import { Camion } from "src/camion/entities/camion.entity";
import { Client } from "src/client/entities/client.entity";
import { Driver } from "src/driver/entities/driver.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

@Entity("mission_sos")
export class MissionSOS {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Informations du client (nom récupéré automatiquement depuis le compte connecté)
    @Column()
    nomClient: string;

    @Column()
    telephoneClient: string;

    // Localisation (GPS partagé automatiquement OU écrit manuellement)
    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    latitudeGPS: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    longitudeGPS: number;

    @Column({ type: 'text', nullable: true })
    adresseManuelle: string; // Si le client écrit l'adresse au lieu de partager GPS

    // Type de panne choisi par le client
    @Column({
        type: 'enum',
        enum: TypePanne,
    })
    typePanne: TypePanne;

    // Description de la panne (optionnelle)
    @Column({ type: 'text', nullable: true })
    descriptionPanne: string;

    // Statut de la mission
    @Column({
        type: 'enum',
        enum: StatutMission,
        default: StatutMission.EN_ATTENTE,
    })
    statut: StatutMission;

    // Dates importantes
    @CreateDateColumn({ type: 'timestamp' })
    dateCreation: Date;

    @Column({ type: 'timestamp', nullable: true })
    dateDebutIntervention: Date;

    @Column({ type: 'timestamp', nullable: true })
    dateFinIntervention: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    dateModification: Date;

    // Informations sur l'affectation du camion
    @Column({ nullable: true })
    tempsEstimeArriveeMinutes: number; // Temps estimé d'arrivée du camion

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    distanceKm: number; // Distance entre le camion et le client

    @Column({ default: false })
    affectationAutomatique: boolean; // true = auto, false = manuelle par admin

    // Notes et informations complémentaires
    @Column({ type: 'text', nullable: true })
    notesChauffeur: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    coutIntervention: number;

    @Column({ type: 'int', nullable: true })
    evaluation: number; // Note de 1 à 5 donnée par le client

    @Column({ type: 'text', nullable: true })
    commentaireClient: string;

    // Relations à ajouter plus tard:
    @ManyToOne(() => Client, client => client.missions)
    @JoinColumn({ name: 'clientId' })
    client: Client;

    

    @ManyToOne(() => Vehicule, vehicule => vehicule.missions)
    @JoinColumn({ name: 'vehiculeId' })
    vehicule: Vehicule;

    

    @ManyToOne(() => Camion, camion => camion.missions)
    @JoinColumn({ name: 'camionId' })
    camion: Camion;

    
    @ManyToOne(() => Driver, driver => driver.missions)
    @JoinColumn({ name: 'chauffeurId' })
    chauffeur: Driver;


}