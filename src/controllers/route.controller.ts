import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { RouteService } from '../services/route.service';

@Controller('routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  @Roles('Адміністратор', 'Користувач', 'Водій')
  getAll() {
    return this.routeService.findAllWithStops();
  }
}
