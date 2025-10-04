import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Transport } from '../entity/transport.entity';
import { TransportService } from '../services/transport.service';
import { TransportController } from '../controllers/transport.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transport, User])],
  providers: [TransportService],
  controllers: [TransportController],
  exports: [TransportService],
})
export class TransportModule {}
