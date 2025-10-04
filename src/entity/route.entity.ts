import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Stop } from './stop.entity';

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
}
