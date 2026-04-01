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

      const logMessage = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;
      const logMeta = { method, url: originalUrl, statusCode, duration, ip };
      if (statusCode < 400) {
        this.logger.log(logMessage, 'HttpLoggerMiddleware', logMeta);
      } else if (statusCode < 500) {
        this.logger.warn(logMessage, 'HttpLoggerMiddleware', logMeta);
      }
    });

    try {
      next();
    } catch (error: any) {
      const duration = Date.now() - start;
      const logMessage = `${method} ${originalUrl} 500 - ${duration}ms`;
      const logMeta = {
        method,
        url: originalUrl,
        statusCode: 500,
        duration,
        ip,
      };
      this.logger.error(
        logMessage,
        'HttpLoggerMiddleware',
        error.stack,
        logMeta,
      );
    }
  }
}
