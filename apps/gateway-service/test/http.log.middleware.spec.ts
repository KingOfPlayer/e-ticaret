import { HttpLoggerMiddleware } from '@e-ticaret/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';

describe('HttpLoggerMiddleware', () => {
  let middleware: HttpLoggerMiddleware;
  let mockWinston: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(async () => {
    mockWinston = {
      info: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpLoggerMiddleware,
        {
          provide: 'winston',
          useValue: mockWinston,
        },
      ],
    }).compile();

    middleware = module.get<HttpLoggerMiddleware>(HttpLoggerMiddleware);

    mockRequest = {
      method: 'GET',
      originalUrl: '/test-url',
      ip: '127.0.0.1',
    };

    mockResponse = {
      statusCode: 200,
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          callback();
        }
        return mockResponse;
      }),
    } as any;
  });

  it('middleware defined', () => {
    expect(middleware).toBeDefined();
  });

  it('middleware should call next()', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('middleware should log request information', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockWinston.info).toHaveBeenCalledWith(
      expect.stringContaining('GET /test-url 200'),
      expect.objectContaining({
        context: 'HTTP',
        method: 'GET',
        url: '/test-url',
        statusCode: 200,
      }),
    );
  });
});
