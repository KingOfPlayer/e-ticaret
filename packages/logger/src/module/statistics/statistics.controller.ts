import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';

@Controller('statistics')
@UseGuards(RoleGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}


  // Returning first index now to history data
  @Get('timeseries')
  @Roles(UserRole.Admin)
  getTimeSeries() {
    return this.statisticsService.getTimeSeries();
  }

  @Get()
  @Roles(UserRole.Admin)
  getEndpointStatistics() {
    return this.statisticsService.getEndpointStatistics();
  }
}
