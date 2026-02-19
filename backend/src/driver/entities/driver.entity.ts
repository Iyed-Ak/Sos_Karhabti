import { Camion } from 'src/camion/entities/camion.entity';
import { MissionSOS } from 'src/mission-sos/entities/mission-so.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ChildEntity, OneToMany, OneToOne, JoinColumn } from 'typeorm';

export enum DriverStatus {
    DISPONIBLE = 'DISPONIBLE',
    EN_INTERVENTION = 'EN_INTERVENTION',
    HORS_SERVICE = 'HORS_SERVICE',
}

@ChildEntity('drivers')
export class Driver extends User {

    @Column({
        type: 'enum',
        enum: DriverStatus,
        default: DriverStatus.HORS_SERVICE,
    })
    statusDriver: DriverStatus;

    @Column({ type: 'timestamp', nullable: true })
    statusUpdatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relations à ajouter plus tard:
    @OneToOne(() => Camion, camion => camion.currentDriverId)
    @JoinColumn({ name: 'camionAssigneId' })
    camionAssigne: Camion;

    @OneToMany(() => MissionSOS, mission => mission.chauffeur)
    missions: MissionSOS[];
}