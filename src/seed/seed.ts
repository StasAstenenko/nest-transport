import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
dotenv.config();

import { ormConfig } from '../config/ormconfig';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { Transport } from '../entity/transport.entity';
import { Route } from '../entity/route.entity';
import { Stop } from '../entity/stop.entity';
import { JobApplication } from '../entity/job-application.entity';

const dataSource = new DataSource({
  ...(ormConfig as DataSourceOptions),
  dropSchema: true,
  synchronize: true,
});

async function run() {
  try {
    await dataSource.initialize();
    console.log('✅ DataSource initialized');

    const roleRepo = dataSource.getRepository(Role);
    const userRepo = dataSource.getRepository(User);
    const transportRepo = dataSource.getRepository(Transport);
    const routeRepo = dataSource.getRepository(Route);
    const stopRepo = dataSource.getRepository(Stop);
    const appRepo = dataSource.getRepository(JobApplication);

    const rUser = await roleRepo.save({ roleName: 'Користувач' });
    const rDriver = await roleRepo.save({ roleName: 'Водій' });
    const rAdmin = await roleRepo.save({ roleName: 'Адміністратор' });

    const admin = userRepo.create({
      name: 'Admin',
      surname: 'Adminov',
      age: 40,
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: rAdmin,
      isActive: true,
    });
    await userRepo.save(admin);

    const ivan = userRepo.create({
      name: 'Ivan',
      surname: 'Petrenko',
      age: 30,
      email: 'ivan@example.com',
      password: await bcrypt.hash('ivan123', 10),
      role: rUser,
      isActive: true,
    });
    await userRepo.save(ivan);

    const olena = userRepo.create({
      name: 'Olena',
      surname: 'Shevchenko',
      age: 28,
      email: 'olena@example.com',
      password: await bcrypt.hash('olena123', 10),
      role: rUser,
      isActive: true,
    });
    await userRepo.save(olena);

    const petro = userRepo.create({
      name: 'Petro',
      surname: 'Koval',
      age: 45,
      email: 'petro@example.com',
      password: await bcrypt.hash('petro123', 10),
      role: rDriver,
      isActive: true,
    });
    await userRepo.save(petro);

    await transportRepo.save([
      {
        type: 'Автобус',
        number: 'AB1234CD',
        capacity: 80,
        transport_condition: 'У гарному стані',
        driver: petro,
      },
      { type: 'Тролейбус', number: 'TR5678EF', capacity: 100 },
      { type: 'Маршрутка', number: 'MR9012GH', capacity: 20 },
    ]);

    const route1 = await routeRepo.save({ name: 'Маршрут №1', distance: 12 });
    const route2 = await routeRepo.save({ name: 'Маршрут №2', distance: 18 });

    await stopRepo.save([
      { route: route1, name: 'Центр', stopOrder: 1 },
      { route: route1, name: 'Ринок', stopOrder: 2 },
      { route: route1, name: 'Вокзал', stopOrder: 3 },
      { route: route2, name: 'Університет', stopOrder: 1 },
      { route: route2, name: 'Площа', stopOrder: 2 },
    ]);

    await appRepo.save([
      { user: ivan, desiredRole: rDriver, status: 'pending' },
      {
        user: olena,
        desiredRole: rDriver,
        status: 'rejected',
        decisionAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    ]);

    console.log('✅ Seed done');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await dataSource.destroy();
  }
}

run();
