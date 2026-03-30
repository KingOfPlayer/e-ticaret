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

  async seedRoutes() {
    const RouteSeed: { [key: string]: string } = {
      '/api/auth': process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
      '/api/products': process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
      '/api/orders': process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
    };

    const existingRoutes = await this.routeModel.find().exec();
    if (existingRoutes && existingRoutes.length > 0) {
      return; 
    }

    for (const prefix in RouteSeed) {
      if (RouteSeed.hasOwnProperty(prefix)) {
        const target = RouteSeed[prefix];
        await this.addRoute({ prefix, target });
      }
    }
  }
}
