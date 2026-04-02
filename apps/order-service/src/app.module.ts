import { Module, NestModule, MiddlewareConsumer, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import {
  HttpLoggerMiddleware,
  LoggerModule,
  StatisticsModule,
} from '@e-ticaret/logger';
import { MicroserviceMiddleware } from '@e-ticaret/microservice';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27013/orders',
      }),
    }),
    OrdersModule,
    LoggerModule.register({ serviceName: 'order-service' }),
    StatisticsModule.register(),
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
