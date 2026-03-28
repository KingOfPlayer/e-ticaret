process.env.MONGO_URI = 'mongodb://127.0.0.1:27018/auth';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);

  console.log('Seeding users...');

  try {
    // Admin User
    await appService.register({
      email: 'admin@ecosystem.com',
      password: 'admin12345',
    }).catch(() => console.log('Admin already exists'));
    
    // Elevate to ADMIN (Directly via model since register defaults to user)
    const userModel = (appService as any).userModel;
    await userModel.updateOne({ email: 'admin@ecosystem.com' }, { role: 'admin' });
    console.log('Admin user created successfully.');

    // Regular User
    await appService.register({
      email: 'user@ecosystem.com',
      password: 'user12345',
    }).catch(() => console.log('User already exists'));
    console.log('Regular user created successfully.');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
