// Dispatcher Tarafı: dispatcher-logger.service.ts
import { BaseLoggerService } from '@e-ticaret/logger';
import { Injectable } from '@nestjs/common';

// dispatcher-logger.service.ts
@Injectable()
export class LoggerService extends BaseLoggerService {
  // Constructor boş kalabilir veya hiç yazılmayabilir.
  // super() çağırma zorunluluğu ortadan kalkar.

  logRouting(url: string, target: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.log(`Routing to ${target}`, url);
  }
}
