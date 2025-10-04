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
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JobsService } from '../services/job.service';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @Roles('Користувач', 'Водій', 'Адміністратор')
  create(@Body() dto: { userId: number; desiredRoleId: number }) {
    return this.jobsService.create(dto.userId, dto.desiredRoleId);
  }

  @Get()
  @Roles('Адміністратор')
  getAll() {
    return this.jobsService.getAll();
  }

  @Get('user/:userId')
  @Roles('Користувач', 'Водій', 'Адміністратор')
  getUserApp(@Param('userId') userId: number) {
    return this.jobsService.getUserApplication(+userId);
  }

  @Patch(':id/approve')
  @Roles('Адміністратор')
  approve(@Param('id') id: number) {
    return this.jobsService.approve(+id);
  }

  @Patch(':id/reject')
  @Roles('Адміністратор')
  reject(@Param('id') id: number) {
    return this.jobsService.reject(+id);
  }
}
