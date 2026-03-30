import { Controller, All, Req, Res, Param, NotFoundException, UseGuards, Get, Post, Patch } from '@nestjs/common';
import * as express from 'express';
import { RouteResolverService } from './route.resolver.service';
import { LoggerService } from '@e-ticaret/logger';
import { RoleGuard } from '@e-ticaret/role';

@Controller("route")
@UseGuards(RoleGuard)
export class RouteResolverController {
  constructor(
    private readonly routeResolverService: RouteResolverService,
  ) {}

  @Patch()
  async getRoutes(@Req() req: express.Request, @Res() res: express.Response) {
    const routes = await this.routeResolverService.refleshRoutes();
    return res.status(200).json(routes);
  }

  @Post()
  async addRoute(@Req() req: express.Request, @Res() res: express.Response) {
    const { prefix, target } = req.body;
    if (!prefix || !target) {
      return res.status(400).json({ message: 'Prefix and target are required' });
    }
    await this.routeResolverService.addRoute({ prefix, target });
    return res.status(201).json({ message: 'Route added successfully' });
  }
}
