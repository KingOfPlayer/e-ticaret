import { Module, NestModule, MiddlewareConsumer, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import {
  HttpLoggerMiddleware,
  LoggerModule,
  StatisticsModule,
} from '@e-ticaret/logger';
import { MicroserviceMiddleware } from '@e-ticaret/microservice';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/products',
    ),
    ProductsModule,
    LoggerModule.register({ serviceName: 'product-service' }),
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
