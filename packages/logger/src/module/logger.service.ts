import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    @Inject('LOGGER_SERVICE_NAME') protected readonly label: string,
  ) {}

  // Bilgi logları (Genel trafik için)
  public log(message: string, context: string, metadata?: any[]) {
    this.logger.info(message, { label: this.label, context, ...metadata });
  }

  // Uyarı logları (Yetki reddi durumları için idealdir)
  public warn(message: string, context: string, metadata?: any[]) {
    this.logger.warn(message, { label: this.label, context, ...metadata });
  }

  // Hata logları (HTTP 4xx/5xx hataları için)
  public error(message: string, context: string, trace?: string, ) {
    this.logger.error(message, { label: this.label, context, stack: trace });
  }

  public info(message: string, context: string) {
    this.logger.info(message, { label: this.label, context });
  }
}
