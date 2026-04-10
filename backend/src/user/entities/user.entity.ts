import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, TableExclusion, TableInheritance } from "typeorm";
import* as argon2 from 'argon2';
@Entity("user")
@TableInheritance({ column: { type: "varchar", name: "role" } })

export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true ,type:"varchar"})
    refreshToken: string|null;

    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    role: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(this.password&& ! this.password.startsWith("$argon2")) {
            this.password= await argon2.hash(this.password);
        }
    }
}

