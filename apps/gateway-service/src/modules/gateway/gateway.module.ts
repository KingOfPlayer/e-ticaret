import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from '../resolver/schemas/route.schema';
import { ResolverModule } from '../resolver/resolver.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    ResolverModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
