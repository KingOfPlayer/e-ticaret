import { Module } from '@nestjs/common';
import { GatewayModule } from './modules/gateway/gateway.module';
import { LogsModule } from './modules/logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/gateway'),
    GatewayModule,
    LogsModule,
  ],
})
export class AppModule {}
