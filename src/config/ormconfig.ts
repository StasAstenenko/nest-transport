import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { User } from '../entity/user.entity';
import { Transport } from '../entity/transport.entity';
import { Route } from '../entity/route.entity';
import { Stop } from '../entity/stop.entity';
import { JobApplication } from '../entity/job-application.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5050),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'stas2004',
  database: process.env.DB_NAME || 'Transports',
  synchronize: false,
  logging: true,
  entities: [User, Role, Transport, Route, Stop, JobApplication],
  logger: 'advanced-console',
};
