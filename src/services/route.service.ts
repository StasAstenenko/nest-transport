import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from '../entity/route.entity';
import { Repository } from 'typeorm';
import { CreateRouteDto } from '../dto/route.dto';

@Injectable()
export class RouteService {
  constructor(@InjectRepository(Route) private routeRepo: Repository<Route>) {}

  async findAllWithStops() {
    return this.routeRepo.find({ relations: ['stops'] });
  }

  async createRoute(dto: CreateRouteDto) {
    const route = this.routeRepo.create({
      name: dto.name,
      distance: dto.distance,
      stops: dto.stops.map((s) => ({ name: s.name, stopOrder: s.order })),
    });
    return this.routeRepo.save(route);
  }

  async getRouteAnalytics() {
    const routes = await this.routeRepo.find({
      relations: ['transports'],
    });

    return routes
      .map((route) => ({
        routeId: route.routeId,
        routeName: route.name,
        transportCount: route.transports.length, // Кількість машин на маршруті
        efficiency:
          route.distance > 0
            ? (route.transports.length / route.distance).toFixed(2)
            : 0,
      }))
      .sort((a, b) => b.transportCount - a.transportCount); // Сортуємо від найпопулярніших
  }
}
