import { Controller, All, Req, Res } from '@nestjs/common';
import * as express from 'express';
import { GatewayService } from './gateway.service';
import { RouteResolverService } from './route-resolver.service';
import { LoggerService } from '@e-ticaret/logger';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly routeResolverService: RouteResolverService,
    private readonly logger: LoggerService,
  ) {}

  @All('*')
  async handleRequest(@Req() req: express.Request, @Res() res: express.Response) {
    const targetBase = this.routeResolverService.resolveService(req.path);
    const servicePath = req.path.replace(targetBase.prefix, '');
    const targetUrl = `${targetBase.url.replace(/\/$/, '')}/${servicePath.replace(/^\//, '')}`;

    try {
      const response = await this.gatewayService.proxyRequest(targetUrl, {
        method: req.method,
        data: req.body,
        headers: req.headers,
        params: req.query,
        req, // Passing original request for IP forwarding
      });
      return res.status(200).json(response);
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
