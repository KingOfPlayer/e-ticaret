import { describe, it, expect, beforeEach } from 'vitest';
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

    const savedLog = await service.createLog(logData);
    expect(savedLog).toMatchObject(logData);
    expect(savedLog.createdAt).toBeDefined();
  });
});
