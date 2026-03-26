import { Test, TestingModule } from '@nestjs/testing';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockWinston: any;

  beforeEach(async () => {
    mockWinston = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockWinston },
        { provide: 'LOGGER_SERVICE_NAME', useValue: 'gateway-service' },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('Log metod', () => {
    const message = 'Log message';
    const context = 'LogContext';
    const metadata = { userId: 123 };
    service.log(message, context, metadata);
    expect(mockWinston.info).toHaveBeenCalledWith(message, expect.objectContaining({ context, userId: 123 }));
  });

  it('Warn metod', () => {
    const message = 'Warn message';
    const context = 'WarnContext';
    const metadata = { userId: 123 };
    service.warn(message, context, metadata);
    expect(mockWinston.warn).toHaveBeenCalledWith(message, expect.objectContaining({ context, userId: 123 }));
  });

  it('Error metod', () => {
    const message = 'Error message';
    const context = 'ErrorContext';
    const stack = new Error("Error").stack;
    const metadata = { userId: 123 };
    service.error(message, context, stack, metadata);
    expect(mockWinston.error).toHaveBeenCalledWith(message, expect.objectContaining({ context, stack, userId: 123 }));
  });

  it('Info metod', () => {
    const message = 'Info message';
    const context = 'InfoContext';
    const metadata = { userId: 123 };
    service.info(message, context, metadata);
    expect(mockWinston.info).toHaveBeenCalledWith(message, expect.objectContaining({ context, userId: 123 }));
  });
});