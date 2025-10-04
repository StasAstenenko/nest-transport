import { Controller, Get } from '@nestjs/common';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  getAll() {
    return this.rolesService.getAll();
  }
}
