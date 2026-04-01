import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route } from './schemas/route.schema';

@Injectable()
export class RouteResolverService implements OnModuleInit {
  private cachedRoutes: Route[] = [];

  constructor(@InjectModel(Route.name) private routeModel: Model<Route>) {}

  async onModuleInit() {
    await this.seedRoutes();
    await this.refleshRoutes();
  }

  async getAllRoutes(): Promise<Route[]> {
    if (!this.cachedRoutes || this.cachedRoutes.length === 0) {
      await this.refleshRoutes();
    }
    return this.cachedRoutes;
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

    const route = this.cachedRoutes.find((r) => path === r.prefix);
    if (!route) {
      return null;
    }

    return { prefix: route.prefix, target: route.target };
  }

  async seedRoutes() {
    const RouteSeed: { prefix: string; target: string }[] = [
      { prefix: 'auth', target: 'http://127.0.0.1:5001' },
      { prefix: 'products', target: 'http://127.0.0.1:5002' },
      { prefix: 'orders', target: 'http://127.0.0.1:5003' },
    ];

    for (const seed of RouteSeed) {
      const existing = await this.routeModel.findOne({ prefix: seed.prefix }).exec();
      if (existing) {
        if (existing.target !== seed.target) {
          await this.routeModel.updateOne({ prefix: seed.prefix }, { target: seed.target }).exec();
        }
      } else {
        await this.addRoute(seed);
      }
    }
  }
}
