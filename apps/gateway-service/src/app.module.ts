import { Module } from '@nestjs/common';
import { GatewayModule } from './modules/gateway/gateway.module';
import { LogsModule } from './modules/logs/logs.module';

@Module({
  imports: [GatewayModule, LogsModule],
})
export class AppModule {}
