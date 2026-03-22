import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schema';

describe('AppController', () => {
  let appController: AppController;
  let app: TestingModule;
  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
          process.env.MONGO_URI || 'mongodb://localhost:27017/auth',
        ),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'super-secret-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    await app.close(); // Close the Nest application
  });

  describe('health', () => {
    it("should return { status: 'ok' }", () => {
      expect(appController.health()).toEqual({ status: 'ok' });
    });
  });
});
