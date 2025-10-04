import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entity/role.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private jwtService: JwtService
  ) {}

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Пароль має бути至少 8 символів');
    }
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Невірний логін або пароль');
    }

    const matched = await bcrypt.compare(pass, user.password);
    if (!matched) {
      throw new UnauthorizedException('Невірний логін або пароль');
    }

    const { password, ...rest } = user;
    return rest;
  }

  async login(user: any, res: any) {
    const payload = {
      userId: user.userId,
      email: user.email,
      role: user.role.roleName,
    };

    const token = this.jwtService.sign(payload);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    return {
      access_token: token,
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role.roleName,
        name: user.name,
        surname: user.surname,
      },
    };
  }

  async register(dto: RegisterDto) {
    this.validatePassword(dto.password);

    const exist = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const role = await this.roleRepo.findOne({
      where: { roleName: 'Користувач' },
    });

    if (!role) {
      throw new BadRequestException('Роль "Користувач" не знайдена');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      surname: dto.surname,
      age: dto.age,
      email: dto.email,
      password: hashed,
      role,
      isActive: true,
    });

    await this.userRepo.save(user);

    return {
      message: 'Реєстрація успішна',
      userId: user.userId,
    };
  }

  async logout(res: any) {
    res.clearCookie('token');
    return { message: 'Ви вийшли' };
  }
}
