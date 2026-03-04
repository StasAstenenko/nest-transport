import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Stop } from './stop.entity';
import { Transport } from './transport.entity';

@Entity({ name: 'routes' })
export class Route {
  @PrimaryGeneratedColumn()
  routeId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  distance!: number;

  @OneToMany(() => Stop, (s) => s.route, { cascade: true })
  stops!: Stop[];

  @OneToMany(() => Transport, (t) => t.route)
  transports!: Transport[];
}
