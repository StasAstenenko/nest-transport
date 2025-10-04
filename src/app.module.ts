import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users.module';
import { TransportModule } from './modules/transport.module';
import { RolesModule } from './modules/roles.module';
import { AuthModule } from './auth/auth.module';
import { ormConfig } from './config/ormconfig';
import { JobsModule } from './modules/job.module';
import { RoutesModule } from './modules/route.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UsersModule,
    TransportModule,
    RolesModule,
    JobsModule,
    RoutesModule,
  ],
})
export class AppModule {}
