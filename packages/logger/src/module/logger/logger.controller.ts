import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import {
  Controller,
  Get,
  Query,
  Inject,
  Res,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import winston, { Logger } from 'winston';
import { QueryLogsDto } from './dtos/query-logs.dto';

@Controller('log')
@UseGuards(RoleGuard)
export class LoggerController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
  ) {}

  @Get()
  @Roles(UserRole.Admin)
  queryLogs(
    @Query(new ValidationPipe({ transform: true })) queryDto: QueryLogsDto,
    @Res() res: Response,
  ) {
    try {
      const options = {
        from: queryDto.from
          ? new Date(queryDto.from)
          : new Date(Date.now() - 24 * 60 * 60 * 1000),
        until: queryDto.until ? new Date(queryDto.until) : new Date(),
        limit: queryDto.limit ?? 10,
        start: queryDto.start ?? 0,
        order: (queryDto.order ?? 'desc') as 'asc' | 'desc',
      } as winston.QueryOptions;

      this.logger.query(options, (err, results) => {
        if (err) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'Log Query Error', details: err });
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Logs retrieved successfully', logs: results });
        }
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Log Query Error', details: error });
    }
  }
}
