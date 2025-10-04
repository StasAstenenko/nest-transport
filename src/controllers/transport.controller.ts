import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { TransportService } from '../services/transport.service';

@Controller('transport')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportController {
  constructor(private transportService: TransportService) {}

  @Get()
  @Roles('Адміністратор', 'Користувач', 'Водій')
  getAll() {
    return this.transportService.findAll();
  }

  @Get('with-drivers')
  @Roles('Адміністратор')
  getWithDrivers() {
    return this.transportService.findAllWithDrivers();
  }

  @Post('assign')
  @Roles('Водій')
  assign(@Body() body: { userId: number; transportId: number }) {
    return this.transportService.assignTransport(body.userId, body.transportId);
  }

  @Post('unassign')
  @Roles('Адміністратор')
  unassign(@Body() body: { transportId: number }) {
    return this.transportService.unassignTransport(body.transportId);
  }
}
