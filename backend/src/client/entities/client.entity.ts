import { ChildEntity, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";
import { MissionSOS } from "src/mission-sos/entities/mission-so.entity";

@ChildEntity("client")
export class Client extends User {

    @Column({ default: "active" })
    status: string;

    @CreateDateColumn({type: 'timestamp' })
    createdAt: Date;

    @Column({ default: 0 })
    totalRequests: number;

    @UpdateDateColumn({type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: 0 })
    nombreVehicules: number;

    @Column({ default: 0 })
    nombreMissionsSOS: number;

    @OneToMany(() => Vehicule, vehicule => vehicule.client, { 
        cascade: true
    })
    vehicules: Vehicule[];

     @OneToMany(() => MissionSOS, (mission) => mission.client, {
        cascade: false,
        eager: false
    })
    missions: MissionSOS[];
}
