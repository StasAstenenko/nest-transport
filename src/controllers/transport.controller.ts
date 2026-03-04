import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { TransportService } from '../services/transport.service';
import { CreateTransportDto } from '../dto/transport.dto';

@Controller('transport')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportController {
  constructor(private transportService: TransportService) {}

  @Get()
  @Roles('Адміністратор', 'Користувач', 'Водій')
  getAll() {
    return this.transportService.findAll();
  }

  @Get('/:userId')
  @Roles('Водій')
  getMyTransport(@Param('userId') userId: number) {
    return this.transportService.myTransport(userId);
  }

  @Post('assign')
  @Roles('Водій', 'Адміністратор')
  assign(@Body() body: { userId: number; transportId: number }) {
    return this.transportService.assignTransport(body.userId, body.transportId);
  }

  @Post('unassign')
  @Roles('Адміністратор')
  unassign(@Body() body: { transportId: number }) {
    return this.transportService.unassignTransport(body.transportId);
  }

  @Patch(':id/assign-route')
  @Roles('Адміністратор')
  assignRoute(@Param('id') id: number, @Body() body: { routeId: number }) {
    return this.transportService.assignRoute(+id, body.routeId);
  }

  @Post()
  @Roles('Адміністратор')
  create(@Body() dto: CreateTransportDto) {
    return this.transportService.create(dto);
  }
}
