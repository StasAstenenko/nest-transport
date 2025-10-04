import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>
  ) {}

  private mapUserToResponse(user: User) {
    return {
      userId: user.userId,
      name: user.name,
      surname: user.surname,
      age: user.age,
      email: user.email,
      role: { id: user.role.roleId, name: user.role.roleName },
      isActive: user.isActive,
    };
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Пароль має бути至少 8 символів');
    }
  }

  async findAll() {
    const users = await this.userRepo.find({
      where: { isActive: true },
      relations: ['role'],
    });
    return users.map(this.mapUserToResponse);
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { userId: id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return this.mapUserToResponse(user);
  }

  async createWorker(dto: CreateWorkerDto) {
    this.validatePassword(dto.password);

    const role = await this.roleRepo.findOne({
      where: { roleName: dto.role },
    });

    if (!role) {
      throw new BadRequestException('Невірна роль');
    }

    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepo.create({
      name: dto.name,
      surname: dto.surname,
      age: dto.age,
      email: dto.email,
      password: hashed,
      role,
      isActive: true,
    });

    await this.userRepo.save(newUser);

    return {
      message: 'Працівника додано',
      userId: newUser.userId,
    };
  }

  async removeWorker(id: number) {
    const user = await this.userRepo.findOne({
      where: { userId: id },
      relations: ['transports', 'applications', 'role'],
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const previousRole = user.role.roleName;
    const userRole = await this.roleRepo.findOne({
      where: { roleName: 'Користувач' },
    });

    if (!userRole) {
      throw new NotFoundException('Роль "Користувач" не знайдена');
    }

    if (user.transports && user.transports.length > 0) {
      for (const transport of user.transports) {
        transport.driver = null;
        await this.userRepo.manager.save(transport);
      }
    }

    const pendingApps = user.applications?.filter(
      (app) => app.status === 'pending'
    );
    if (pendingApps && pendingApps.length > 0) {
      for (const app of pendingApps) {
        app.status = 'rejected';
        await this.userRepo.manager.save(app);
      }
    }

    user.role = userRole;
    user.isActive = false;
    await this.userRepo.save(user);

    return {
      message: 'Користувача звільнено',
      freedTransports: user.transports?.length || 0,
      cancelledApplications: pendingApps?.length || 0,
      previousRole: previousRole,
    };
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { userId: id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (dto.role) {
      const role = await this.roleRepo.findOne({
        where: { roleName: dto.role },
      });

      if (!role) {
        throw new BadRequestException('Невірна роль');
      }

      user.role = role;
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepo.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Користувач з таким email вже існує');
      }
    }

    user.name = dto.name ?? user.name;
    user.surname = dto.surname ?? user.surname;
    user.age = dto.age ?? user.age;
    user.email = dto.email ?? user.email;

    await this.userRepo.save(user);

    return { message: 'Користувача оновлено' };
  }
}
