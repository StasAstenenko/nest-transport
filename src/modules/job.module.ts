import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from '../entity/job-application.entity';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { JobsService } from '../services/job.service';
import { JobsController } from '../controllers/job.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication, User, Role])],
  providers: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
