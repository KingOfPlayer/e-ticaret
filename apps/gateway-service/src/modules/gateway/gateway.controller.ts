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
    console.log(`Proxying request to: ${targetUrl}`);
    try {
      const response = await this.gatewayService.proxyRequest(targetUrl, {
        method: req.method,
        data: req.body,
        headers: req.headers,
        params: req.query,
      });
      return res.status(200).json(response);
    } catch (error: any) {
      this.logger.error(
        `Error proxying request to ${targetUrl}: ${error.message}`,
        'GatewayService',
        error,
        {
          method: req.method,
          url: req.originalUrl,
          targetUrl,
          error: error.response?.data || error.message,
        },
      );
      const statusCode = error.status || 500;
      return res.status(statusCode).json(error.response?.data || { message: error.message });
    }
  }
}
