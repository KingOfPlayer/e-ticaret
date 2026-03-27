import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';

@Controller('statistics')
@UseGuards(RoleGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @Roles(UserRole.Admin)
  GetTrafficSummary() {
    return this.statisticsService.GetTrafficSummary();
  }
}
