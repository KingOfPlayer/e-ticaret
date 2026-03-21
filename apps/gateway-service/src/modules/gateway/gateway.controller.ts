import { Controller, All, Req, Res } from '@nestjs/common';
import * as express from 'express';
import { GatewayService } from './gateway.service';
import { RouteResolverService } from './route-resolver.service';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly routeResolverService: RouteResolverService,
  ) {}

  @All('*')
  async handleRequest(@Req() req: express.Request, @Res() res: express.Response) {
    const targetBaseUrl = this.routeResolverService.resolveService(req.path);
    console.log(`Received request: ${req.method} ${req.path}, forwarding to: ${targetBaseUrl}`);
    const targetUrl = `${targetBaseUrl}${req.path.replace(/^\/api/, '')}`;
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
      console.error(`Error occurred while proxying request to ${targetUrl}:`, error);
      const statusCode = error.response?.status || 500;
      return res.status(statusCode).json(error.response?.data || { message: error.message });
    }
  }
}
