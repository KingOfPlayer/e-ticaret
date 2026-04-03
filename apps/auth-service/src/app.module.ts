import { Module, NestModule, MiddlewareConsumer, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
  HttpLoggerMiddleware,
  LoggerModule,
  StatisticsModule,
} from '@e-ticaret/logger';
import { MicroserviceMiddleware } from '@e-ticaret/microservice';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27011/auth',
      }),
    }),
    LoggerModule.register({ serviceName: 'auth-service' }),
    StatisticsModule.register(),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    consumer
      .apply(MicroserviceMiddleware as Type<MicroserviceMiddleware>)
      .forRoutes('*');
  }
}
