import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route } from './schemas/route.schema';

@Injectable()
export class RouteResolverService implements OnModuleInit {

  private cachedRoutes: Route[] = [];

  constructor(
    @InjectModel(Route.name) private routeModel: Model<Route>,
  ) {
  }

  async onModuleInit() {
    await this.refleshRoutes();
  }

  async addRoute(route: { prefix: string; target: string }) {
    const newRoute = await this.routeModel.create(route);
    this.cachedRoutes.push(newRoute);
  }

  async refleshRoutes() {
    const routes = await this.routeModel.find().exec();
    this.cachedRoutes = routes ?? [];
  }

  async resolveRoute(path: string): Promise<{ prefix: string; target: string } | null> {
    if (!this.cachedRoutes || this.cachedRoutes.length === 0) {
      await this.refleshRoutes();
    }

    const route = this.cachedRoutes.find(r => path.startsWith(r.prefix));
    if (!route) {
      return null;
    }

    return { prefix: route.prefix, target: route.target };
  }

}
