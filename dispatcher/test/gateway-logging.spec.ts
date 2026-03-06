import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from '../src/modules/logs/logs.service';

describe('GatewayLogging (Red Phase)', () => {
  let service: LogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsService],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a request log with correct data', async () => {
    const logData = {
      path: '/api/products',
      method: 'GET',
      statusCode: 200,
      latencyMs: 50,
      service: 'product-service',
      userId: 'user123',
    };

    // This will fail because createLog is not implemented
    const savedLog = await service.createLog(logData);
    expect(savedLog).toMatchObject(logData);
    expect(savedLog.createdAt).toBeDefined();
  });

  it('should calculate metrics for a specific service', async () => {
    // This will fail because getMetrics is not implemented
    const metrics = await service.getMetrics('product-service');
    expect(metrics).toHaveProperty('averageLatency');
    expect(metrics).toHaveProperty('totalRequests');
  });
});
