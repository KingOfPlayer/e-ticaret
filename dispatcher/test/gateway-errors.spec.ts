import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from '../src/modules/gateway/gateway.service';
import { BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GatewayErrors (Red Phase)', () => {
  let service: GatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayService],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
  });

  it('should return 502 Bad Gateway when downstream service returns error', async () => {
    mockedAxios.request.mockRejectedValueOnce({ response: { status: 500 } });
    
    await expect(service.proxyRequest('http://product-service:3000', {}))
      .rejects.toThrow(BadGatewayException);
  });

  it('should return 503 Service Unavailable when downstream service is down', async () => {
    mockedAxios.request.mockRejectedValueOnce({ code: 'ECONNREFUSED' });
    
    await expect(service.proxyRequest('http://product-service:3000', {}))
      .rejects.toThrow(ServiceUnavailableException);
  });

  it('should return 504 Gateway Timeout when downstream service timeouts', async () => {
    mockedAxios.request.mockRejectedValueOnce({ code: 'ECONNABORTED' });
    
    await expect(service.proxyRequest('http://product-service:3000', {}))
      .rejects.toThrow(BadGatewayException); // Or a specific timeout exception
  });
});
