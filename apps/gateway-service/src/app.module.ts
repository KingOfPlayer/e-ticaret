import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayModule } from './modules/gateway/gateway.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpLoggerMiddleware, LoggerModule } from '@e-ticaret/logger';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/gateway'),
    LoggerModule.register({ serviceName: 'gateway-service' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    GatewayModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
