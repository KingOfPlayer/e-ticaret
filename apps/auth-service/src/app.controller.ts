import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import { User } from './schemas/user.schema';

@Controller('')
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
@UseGuards(RoleGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.appService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.appService.login(loginDto);
  }

  @Get('health')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Roles(UserRole.Admin, UserRole.User)
  health(): any {
    return this.appService.health();
  }
}
