import { Module } from '@nestjs/common';
import { GatewayModule } from './modules/gateway/gateway.module';

@Module({
  imports: [GatewayModule],
})
export class AppModule {}
