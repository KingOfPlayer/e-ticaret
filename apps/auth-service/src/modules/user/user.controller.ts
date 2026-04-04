import { RoleGuard, Roles, UserRole } from '@e-ticaret/role';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from './dtos/user.profile.dto';
import { UpdateUserDto } from './dtos/user.update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfileById(@Headers('x-user-id') userId: string): Promise<any> {
    return this.userService.findById(userId);
  }

  @Patch()
  async updateProfile(
    @Headers('x-user-id') userId: string,
    @Body() userUpdateDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(userId, userUpdateDto);
  }
}
