import { DynamicModule, Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { LoggerModule } from '../logger/logger.module';

@Global()
@Module({})
export class StatisticsModule {
  static register(): DynamicModule {
    return {
      module: StatisticsModule,
      imports: [ScheduleModule.forRoot(),LoggerModule],
      controllers: [StatisticsController],
      providers: [StatisticsService],
      exports: [StatisticsService],
    };
  }
}
