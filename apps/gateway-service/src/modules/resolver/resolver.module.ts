import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './schemas/route.schema';
import { RouteResolverController as ResolverController } from './resolver.controller';
import { ResolverService as ResolverService } from './resolver.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }])],
  controllers: [ResolverController],
  providers: [ResolverService],
  exports: [ResolverService],
})
export class ResolverModule {}
