import { DynamicModule, Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Global()
@Module({})
export class LoggerModule {
  static register(options: { serviceName: string }): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.label({ label: options.serviceName }),
                winston.format.json(),
              ),
            }),
            new winston.transports.File({
              filename: `logs/${options.serviceName}-${new Date().toISOString().slice(0, 10)}.log`,
            }),
          ],
        }),
      ],
      exports: [WinstonModule],
    };
  }
}
