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

      const response = await axios.request({
        url,
        ...config,
        timeout: 5000, // Set a timeout for the request
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // Downstream service returned an error (e.g., 500)
        throw new BadGatewayException('Downstream service error');
      } else if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        // Downstream service is down
        throw new ServiceUnavailableException('Downstream service is unavailable');
      } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        // Request timed out
        throw new GatewayTimeoutException('Downstream service request timed out');
      }
      throw error;
    }
  }
}
