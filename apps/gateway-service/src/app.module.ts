import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayModule } from './modules/gateway/gateway.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpLoggerMiddleware, LoggerModule } from '@e-ticaret/logger';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/gateway'),
    LoggerModule.register({ serviceName: 'gateway-service' }),
    GatewayModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
