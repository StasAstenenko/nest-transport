import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { RouteService } from '../services/route.service';
import { CreateRouteDto } from '../dto/route.dto';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  @Roles('Адміністратор', 'Користувач', 'Водій')
  getAll() {
    return this.routeService.findAllWithStops();
  }

  @Post()
  @Roles('Адміністратор')
  create(@Body() dto: CreateRouteDto) {
    return this.routeService.createRoute(dto);
  }

  @Get('analytics')
  @Roles('Адміністратор')
  getAnalytics() {
    return this.routeService.getRouteAnalytics();
  }
}
