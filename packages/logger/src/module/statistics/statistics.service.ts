import { Injectable, OnModuleInit, Res } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

type EndpointStatistics = {
  totalRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  statusCodeDistribution: Record<number, number>;
};

@Injectable()
export class StatisticsService implements OnModuleInit {

  private timeSeries: EndpointStatistics[] = [];
  private endpointStats: Record<string, EndpointStatistics> = {};

  onModuleInit() {
    for (let i = 0; i < 10; i++) {
      this.timeSeries.push({
        totalRequests: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        statusCodeDistribution: {}
      });
    }
  }

  addRequestStatistics(endpoint: string, statusCode: number, responseTime: number) {
    this.addTimeSeriesStatistics(statusCode, responseTime);
    this.addEndpointStatistics(endpoint, statusCode, responseTime);
  } 

  addTimeSeriesStatistics(statusCode: number, responseTime: number) {
    
    if(this.timeSeries[0].totalRequests === 0) {
      this.timeSeries[0].minResponseTime = responseTime;
      this.timeSeries[0].maxResponseTime = responseTime;
    }
    
    this.timeSeries[0].totalRequests++;
    this.timeSeries[0].averageResponseTime =
      (this.timeSeries[0].averageResponseTime * (this.timeSeries[0].totalRequests - 1) + responseTime) /
      this.timeSeries[0].totalRequests;
    this.timeSeries[0].minResponseTime = Math.min(this.timeSeries[0].minResponseTime, responseTime);
    this.timeSeries[0].maxResponseTime = Math.max(this.timeSeries[0].maxResponseTime, responseTime);
    this.timeSeries[0].statusCodeDistribution[statusCode] =
      (this.timeSeries[0].statusCodeDistribution[statusCode] || 0) + 1;
  }

  addEndpointStatistics(endpoint: string, statusCode: number, responseTime: number) {
    this.endpointStats[endpoint] = this.endpointStats[endpoint] || {
      totalRequests: 0,
      averageResponseTime: 0,
      minResponseTime: responseTime,
      maxResponseTime: responseTime,
      statusCodeDistribution: {}
    };
    const stats = this.endpointStats[endpoint];
    stats.totalRequests++;
    stats.averageResponseTime =
      (stats.averageResponseTime * (stats.totalRequests - 1) + responseTime) /
      stats.totalRequests;
    stats.minResponseTime = Math.min(stats.minResponseTime, responseTime);
    stats.maxResponseTime = Math.max(stats.maxResponseTime, responseTime);
    stats.statusCodeDistribution[statusCode] =
      (stats.statusCodeDistribution[statusCode] || 0) + 1;
  }

  // Every minute shift
  @Cron('0 * * * * *')
  shiftTimeSeries() {
    this.timeSeries.unshift({
      totalRequests: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      statusCodeDistribution: {}
    });
    this.timeSeries.pop();
  }

  getTimeSeries() {
    return this.timeSeries;
  }

  getEndpointStatistics() {
    return this.endpointStats;
  }
}
