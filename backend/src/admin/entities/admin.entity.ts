import { ChildEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

@ChildEntity('admin')
export class Admin extends User {

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  adminRole: AdminRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relations à ajouter plus tard si besoin:
  // @OneToMany(() => MissionSOS, mission => mission.adminAffecteur)
  // missionsGerees: MissionSOS[];
}