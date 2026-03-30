import { Controller, All, Req, Res, Param, NotFoundException, UseGuards, Get, Post, Patch, BadRequestException } from '@nestjs/common';
import * as express from 'express';
import { RouteResolverService } from './route.resolver.service';
import { LoggerService } from '@e-ticaret/logger';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';

@Controller("route")
@UseGuards(RoleGuard)
@Roles(UserRole.Admin)
export class RouteResolverController {
  constructor(
    private readonly routeResolverService: RouteResolverService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async getRoute(@Req() req: express.Request, @Res() res: express.Response) {
    const routes = await this.routeResolverService.getAllRoutes();
    return res.status(200).json(routes);
  }

  @Patch()
  async getRoutes(@Req() req: express.Request, @Res() res: express.Response) {
    await this.routeResolverService.refleshRoutes();
    this.logger.info(`Routes refreshed successfully`, 'RouteResolverController');
    return res.status(204).send();
  }

  @Post()
  async addRoute(@Req() req: express.Request, @Res() res: express.Response) {
    const { prefix, target } = req.body;
    if (!prefix || !target) {
      return new BadRequestException('Prefix and target are required');
    }
    await this.routeResolverService.addRoute({ prefix, target });
    this.logger.info(`Added new route: ${prefix} -> ${target}`, 'RouteResolverController');
    return res.status(201).json({ message: 'Route added successfully' });
  }
}
