import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Route } from './route.entity';

@Entity({ name: 'stops' })
export class Stop {
  @PrimaryGeneratedColumn()
  stopId!: number;

  @Column()
  name!: string;

  @Column({ name: 'stop_order' })
  stopOrder!: number;

  @ManyToOne(() => Route, (r) => r.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route!: Route;
}
