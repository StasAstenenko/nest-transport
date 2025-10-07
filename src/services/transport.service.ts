import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from '../entity/transport.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport) private transportRepo: Repository<Transport>,
    @InjectRepository(User) private userRepo: Repository<User>
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
}
