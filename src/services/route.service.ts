import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from '../entity/route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RouteService {
  constructor(@InjectRepository(Route) private routeRepo: Repository<Route>) {}

  async findAllWithStops() {
    return this.routeRepo.find({ relations: ['stops'] });
  }
}
