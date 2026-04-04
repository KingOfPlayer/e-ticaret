import { LoggerService } from '@e-ticaret/logger';
import {
  Injectable,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GatewayService {
  constructor(private loggerService: LoggerService) {}

  async proxyRequest(url: string, config: any): Promise<any> {
    try {
      delete config.headers['content-length'];
      delete config.headers['host'];
      delete config.headers['accept-encoding'];

      // Add X-Forwarded-For if not already present

      if (config.req) {
        config.headers['x-forwarded-for'] =
          config.req.headers['x-forwarded-for'] || config.req.socket.remoteAddress;
      }

      config.headers['x-gateway-secret'] = process.env.GATEWAY_SECRET || 'gateway-secret';

      const response = await axios.request({
        url,
        ...config,
        timeout: 60000,
      });
      return { status: response.status, data: response.data };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Reflect the actual status and data from the downstream service
        const statusCode = error.response.status;
        const errorData = error.response.data;

        this.loggerService.error(`Downstream error from ${url}`, 'GatewayService', undefined, {
          error: errorData,
        });

        throw {
          status: statusCode,
          message: errorData?.message || 'Downstream service error',
          response: { data: errorData },
        };
      } else if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new ServiceUnavailableException('Downstream service is unavailable');
      } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        throw new GatewayTimeoutException('Downstream service request timed out');
      }
      throw error;
    }
  }
}
