import { Injectable } from "@nestjs/common";

type EndpointStatistics = {
    totalRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    statusCodeDistribution: Record<number, number>;
}

@Injectable()
export class StatisticsService {
    private statistics: Record<string, EndpointStatistics> = {};

    RecordStatistics(endpoint: string, statusCode: number, responseTime: number) {
        if (!this.statistics[endpoint]) {
            this.statistics[endpoint] = {
                totalRequests: 0,
                averageResponseTime: 0,
                minResponseTime: responseTime,
                maxResponseTime: responseTime,
                statusCodeDistribution: {},
            };
        }

        const stats = this.statistics[endpoint];
        stats.totalRequests++;
        stats.averageResponseTime =
            (stats.averageResponseTime * (stats.totalRequests - 1) + responseTime) /
            stats.totalRequests;
        stats.minResponseTime = Math.min(stats.minResponseTime, responseTime);
        stats.maxResponseTime = Math.max(stats.maxResponseTime, responseTime);
        stats.statusCodeDistribution[statusCode] =
            (stats.statusCodeDistribution[statusCode] || 0) + 1;
    }

    GetTrafficSummary() {
        return this.statistics;
    }
}