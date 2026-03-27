import { DynamicModule, Global, Module } from "@nestjs/common";
import { StatisticsService } from "./statistics.service";
import { StatisticsController } from "./statistics.controller";

@Global()
@Module({})
export class StatisticsModule {
    static register(): DynamicModule {
        return {
            module: StatisticsModule,
            controllers: [StatisticsController],
            providers: [StatisticsService],
            exports: [StatisticsService],
        };
    }
}