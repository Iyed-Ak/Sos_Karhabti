import { ChildEntity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

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


}
