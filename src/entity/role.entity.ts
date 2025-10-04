import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  roleId!: number;

  @Column({ unique: true })
  roleName!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
