import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@e-ticaret/logger';

@Injectable()
export class MicroserviceMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    //Checking gateway service secret
    const gatewaySecret = process.env.GATEWAY_SECRET || 'gateway-secret';
    const requestSecret = req.headers['x-gateway-secret'];

    if (gatewaySecret && requestSecret !== gatewaySecret) {
      this.logger.warn(
        'Unauthorized access attempt to microservice',
        'MicroserviceMiddleware',
      );

      throw new ForbiddenException(
        'Unauthorized access: Only Dispatcher is allowed',
      );
    }

    next();
  }
}
