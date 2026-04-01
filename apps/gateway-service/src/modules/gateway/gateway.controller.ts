import { Controller, All, Req, Res, Param, NotFoundException } from '@nestjs/common';
import * as express from 'express';
import { GatewayService } from './gateway.service';
import { LoggerService } from '@e-ticaret/logger';
import { RouteResolverService } from '../resolver/route.resolver.service';

import { addHateoasLinks } from '../../common/utils/hateoas.util';

@Controller('api')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly routeResolverService: RouteResolverService,
    private readonly logger: LoggerService,
  ) {}

  @All('*path')
  async handleRequest(
    @Req() req: express.Request,
    @Res() res: express.Response,
    @Param('path') path: any,
  ) {
    const fullPath = path.join('/');
    const target = await this.routeResolverService.resolveRoute(fullPath);

    if (!target) {
      this.logger.warn(`No route found for path: ${fullPath}`, 'GatewayController');
      throw new NotFoundException(`No route found`);
    }
    const targetUrl = target.target + fullPath.substring(target.prefix.length);

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    req.headers['x-forwarded-for'] = clientIp;

    try {
      const { status, data } = await this.gatewayService.proxyRequest(targetUrl, {
        method: req.method,
        data: req.body,
        headers: req.headers,
        params: req.query,
        req, // Passing original request for IP forwarding
      });
      
      const hateoasData = addHateoasLinks(req.originalUrl, data);
      
      return res.status(status).json(hateoasData);
    } catch (error: any) {
      if (error.status >= 400) {
        const errorMessage = error.message || 'Unknown proxy error';
        this.logger.error(
          `Error proxying request to ${targetUrl}: ${errorMessage}`,
          'GatewayService',
          error.stack || undefined,
          {
            method: req.method,
            url: req.originalUrl,
            targetUrl,
            error: error.response?.data || errorMessage,
          },
        );
      }
      const statusCode = error.status || 500;
      return res.status(statusCode).json(error.response?.data);
    }
  }
}
