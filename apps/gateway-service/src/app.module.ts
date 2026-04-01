import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayModule } from './modules/gateway/gateway.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpLoggerMiddleware, LoggerModule, StatisticsModule } from '@e-ticaret/logger';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ResolverModule } from './modules/resolver/resolver.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27014/gateway'),
    LoggerModule.register({ serviceName: 'gateway-service' }),
    StatisticsModule.register(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '60s' },
    }),
    ResolverModule,
    GatewayModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
