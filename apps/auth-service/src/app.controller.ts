import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
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
  health(): any {
    return this.appService.health();
  }
}
