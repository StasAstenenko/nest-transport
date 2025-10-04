import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../entity/route.entity';
import { Stop } from '../entity/stop.entity';
import { RouteService } from '../services/route.service';
import { RouteController } from '../controllers/route.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Stop])],
  providers: [RouteService],
  controllers: [RouteController],
  exports: [RouteService],
})
export class RoutesModule {}
