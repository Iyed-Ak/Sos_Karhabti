import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ChildEntity } from 'typeorm';

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
    status: DriverStatus;

    @Column({ type: 'timestamp', nullable: true })
    statusUpdatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}