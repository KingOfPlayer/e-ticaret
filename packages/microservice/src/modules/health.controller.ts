import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import { Controller, Get, Global, Injectable, UseGuards } from '@nestjs/common';

@Global()
@Injectable()
@Controller('health')
@UseGuards(RoleGuard)
@Roles(UserRole.Admin)
export class HealthController {
  @Get()
  getHealthStatus() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
