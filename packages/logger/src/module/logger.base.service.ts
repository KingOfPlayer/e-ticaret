import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export abstract class BaseLoggerService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
  ) {}

  // Bilgi logları (Genel trafik için)
  public log(message: string, context?: string | any) {
    this.logger.info(message, { context });
  }

  // Uyarı logları (Yetki reddi durumları için idealdir)
  public warn(message: string, context?: string | any) {
    this.logger.warn(message, { context });
  }

  // Hata logları (HTTP 4xx/5xx hataları için)
  public error(message: string, trace?: string, context?: string | any) {
    this.logger.error(message, { stack: trace, context });
  }

  public info(message: string, context?: string | any) {
    this.logger.info(message, { context });
  }
}
