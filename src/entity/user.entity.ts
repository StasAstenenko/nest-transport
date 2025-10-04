import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { JobApplication } from './job-application.entity';
import { Transport } from './transport.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  surname!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => JobApplication, (app) => app.user)
  applications!: JobApplication[];

  @OneToMany(() => Transport, (t) => t.driver)
  transports!: Transport[];
}
