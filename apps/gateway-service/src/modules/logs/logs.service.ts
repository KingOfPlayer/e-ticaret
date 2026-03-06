import { Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  private readonly logs: any[] = [];

  async createLog(logData: {
    path: string;
    method: string;
    statusCode: number;
    latencyMs: number;
    service: string;
    userId?: string;
  }): Promise<any> {
    const newLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    // In a real scenario, we would save this to MongoDB
    this.logs.push(newLog);

    return newLog;
  }

  async findAll(): Promise<any[]> {
    return this.logs;
  }
}
