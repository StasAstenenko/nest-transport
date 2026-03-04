import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from '../entity/transport.entity';
import { User } from '../entity/user.entity';
import { Route } from '../entity/route.entity';
import { CreateTransportDto } from '../dto/transport.dto';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport) private transportRepo: Repository<Transport>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Route) private routeRepo: Repository<Route>
  ) {}

  async findAll() {
    return this.transportRepo.find({ relations: ['driver'] });
  }

  async assignTransport(userId: number, transportId: number) {
    const transport = await this.transportRepo.findOne({
      where: { transportId },
      relations: ['driver'],
    });
    if (!transport) throw new NotFoundException('Транспорт не знайдено');
    if (transport.driver) {
      if (transport.driver.userId === userId) return transport;
      throw new BadRequestException(
        'Цей транспорт вже закріплено за іншим водієм'
      );
    }
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('Користувача не знайдено');

    transport.driver = user;
    await this.transportRepo.save(transport);
    return { message: 'Транспорт закріплено' };
  }

  async myTransport(userId: number) {
    const transport = await this.transportRepo.findOne({
      where: { driver: { userId: userId } },
      relations: ['driver'],
    });

    console.log(userId);

    if (!transport) {
      throw new NotFoundException('Транспорт не знайдено для цього водія');
    }

    return transport;
  }

  async unassignTransport(transportId: number) {
    const transport = await this.transportRepo.findOne({
      where: { transportId },
      relations: ['driver'],
    });
    if (!transport) throw new NotFoundException('Транспорт не знайдено');
    transport.driver = null;
    await this.transportRepo.save(transport);
    return { message: 'Транспорт звільнено' };
  }

  async assignRoute(transportId: number, routeId: number) {
    const transport = await this.transportRepo.findOne({
      where: { transportId },
    });
    if (!transport) throw new NotFoundException('Транспорт не знайдено');

    const route = await this.routeRepo.findOne({ where: { routeId } });
    if (!route) throw new NotFoundException('Маршрут не знайдено');

    transport.route = route;
    await this.transportRepo.save(transport);

    return {
      message: `Транспорт ${transport.number} закріплено за маршрутом ${route.name}`,
    };
  }

  // ... інші методи

  async create(dto: CreateTransportDto) {
    const newTransport = this.transportRepo.create(dto);
    return await this.transportRepo.save(newTransport);
  }
}
