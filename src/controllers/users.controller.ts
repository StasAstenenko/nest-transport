import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../services/users.service';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('Адміністратор')
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('add-worker')
  @Roles('Адміністратор')
  addWorker(@Body() dto: CreateWorkerDto) {
    return this.usersService.createWorker(dto);
  }

  @Delete(':id')
  @Roles('Адміністратор')
  removeWorker(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeWorker(id);
  }

  @Patch(':id')
  @Roles('Адміністратор')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateUser(id, dto);
  }
}
