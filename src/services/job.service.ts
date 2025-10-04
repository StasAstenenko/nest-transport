import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../entity/job-application.entity';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobApplication)
    private appRepo: Repository<JobApplication>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>
  ) {}

  async create(userId: number, desiredRoleId: number) {
    const user = await this.userRepo.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const role = await this.roleRepo.findOne({
      where: { roleId: desiredRoleId },
    });

    if (!role) {
      throw new NotFoundException('Роль не знайдена');
    }

    const existing = await this.appRepo.findOne({
      where: { user: { userId }, status: 'pending' },
    });

    if (existing) {
      throw new BadRequestException('У вас вже є активна заявка');
    }

    const app = this.appRepo.create({ user, desiredRole: role });
    return this.appRepo.save(app);
  }

  async getAll() {
    return this.appRepo.find({
      relations: ['user', 'desiredRole'],
    });
  }

  async getUserApplication(userId: number) {
    return this.appRepo.findOne({
      where: { user: { userId } },
      relations: ['desiredRole'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: number) {
    const app = await this.appRepo.findOne({
      where: { id },
      relations: ['user', 'desiredRole'],
    });

    if (!app) {
      throw new NotFoundException('Заявку не знайдено');
    }

    app.status = 'approved';
    app.decisionAt = new Date();

    app.user.role = app.desiredRole;
    await this.userRepo.save(app.user);
    await this.appRepo.save(app);

    return { message: 'Заявку схвалено' };
  }

  async reject(id: number) {
    const app = await this.appRepo.findOne({
      where: { id },
    });

    if (!app) {
      throw new NotFoundException('Заявку не знайдено');
    }

    app.status = 'rejected';
    app.decisionAt = new Date();
    await this.appRepo.save(app);

    return { message: 'Заявку відхилено' };
  }
}
