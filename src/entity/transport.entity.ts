import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
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

  @ManyToOne(() => User, (user) => user.transports, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver!: User | null;

  @RelationId((transport: Transport) => transport.driver)
  driverId!: number | null;
}
