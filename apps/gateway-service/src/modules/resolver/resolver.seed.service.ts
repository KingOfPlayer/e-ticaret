import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route } from './schemas/route.schema';

@Injectable()
export class ResolverSeedService implements OnModuleInit {
  private cachedRoutes: Route[] = [];

  constructor(@InjectModel(Route.name) private routeModel: Model<Route>) {}

  async onModuleInit() {
    await this.seedRoutes();
  }

  async seedRoutes() {
    const RouteSeed: { prefix: string; target: string }[] = [
      {
        prefix: 'auth',
        target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001',
      },
      {
        prefix: 'products',
        target: process.env.PRODUCT_SERVICE_URL || 'http://127.0.0.1:5002',
      },
      {
        prefix: 'orders',
        target: process.env.ORDER_SERVICE_URL || 'http://127.0.0.1:5003',
      },
    ];

    for (const seed of RouteSeed) {
      const existing = await this.routeModel.findOne({ prefix: seed.prefix }).exec();
      if (existing) {
        if (existing.target !== seed.target) {
          await this.routeModel.updateOne({ prefix: seed.prefix }, { target: seed.target }).exec();
        }
      }
    }
  }
}
