import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './schemas/route.schema';
import { RouteResolverController } from './resolver.controller';
import { RouteResolverService } from './route.resolver.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
  ],
  controllers: [RouteResolverController],
  providers: [ RouteResolverService],
  exports: [RouteResolverService],
})
export class ResolverModule {}
