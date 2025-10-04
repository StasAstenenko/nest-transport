import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'transport' })
export class Transport {
  @PrimaryGeneratedColumn()
  transportId!: number;

  @Column()
  type!: string;

  @Column({ nullable: true })
  number!: string;

  @Column({ nullable: true })
  capacity!: number;

  @Column({ nullable: true, name: 'transport_condition' })
  condition!: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId!: number | null;

  @ManyToOne(() => User, (user) => user.transports, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver!: User | null;
}
