import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({ name: 'job_applications' })
export class JobApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'desiredRoleId' })
  desiredRole!: Role;

  @Column({ default: 'pending' })
  status!: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  decisionAt!: Date;
}
