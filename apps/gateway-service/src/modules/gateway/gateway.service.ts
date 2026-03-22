import { Injectable, BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GatewayService {
  async proxyRequest(url: string, config: any): Promise<any> {
    try {
      const response = await axios.request({
        url,
        ...config,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // Downstream service returned an error (e.g., 500)
        throw new BadGatewayException('Downstream service error');
      } else if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || !error.response)) {
        // Downstream service is down
        throw new ServiceUnavailableException('Downstream service is unavailable');
      }

      throw error;
    }
  }
}
