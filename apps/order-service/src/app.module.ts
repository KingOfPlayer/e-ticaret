import { Module, NestModule, MiddlewareConsumer, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import {
  HttpLoggerMiddleware,
  LoggerModule,
  StatisticsModule,
} from '@e-ticaret/logger';
import { MicroserviceMiddleware } from '@e-ticaret/microservice';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/orders',
    ),
    OrdersModule,
    LoggerModule.register({ serviceName: 'order-service' }),
    StatisticsModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    consumer
      .apply(MicroserviceMiddleware as Type<MicroserviceMiddleware>)
      .forRoutes('*');
  }
}
