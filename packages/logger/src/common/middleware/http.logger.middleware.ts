import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LoggerService } from '../../module/logger/logger.service';
import { StatisticsService } from '../../module/statistics/statistics.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly statistics: StatisticsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      this.statistics.RecordStatistics(originalUrl, statusCode, duration);

      this.logger.info(
        `${method} ${originalUrl} ${statusCode} - ${duration}ms`,
        'HttpLoggerMiddleware',
        {
          method,
          url: originalUrl,
          statusCode,
          duration,
          ip,
        },
      );
    });

    next();
  }
}
