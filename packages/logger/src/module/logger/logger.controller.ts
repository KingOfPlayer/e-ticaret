import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import winston, { Logger } from 'winston';

@Controller('log')
@UseGuards(RoleGuard)
export class LoggerController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
  ) {}

  @Post()
  @Roles(UserRole.Admin)
  createLog(
    @Body() body: { options?: winston.QueryOptions | undefined },
    @Res() res: Response,
  ) {
    try {
      const options = {
        from: new Date(Date.now() - 24 * 60 * 60 * 1000),
        until: new Date(),
        limit: 10,
        start: 0,
        order: 'desc',
        ...(body && body.options ? body.options : {}),
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
