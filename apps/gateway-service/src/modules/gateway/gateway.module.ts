import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { RouteResolverService } from './route-resolver.service';

@Module({
  controllers: [GatewayController],
  providers: [GatewayService, RouteResolverService],
  exports: [GatewayService],
})
export class GatewayModule {}
