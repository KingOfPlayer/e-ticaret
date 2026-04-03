import { RoleGuard, Roles, UserRole } from "@e-ticaret/role";
import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserProfileDto } from "./dtos/user.profile.dto";
import { UpdateUserDto } from "./dtos/user.update.dto";
import { UserQueryDto } from "./dtos/user.query.dto";
import { User } from "./schemas/user.schema";

@Controller('admin/user')
@UseGuards(RoleGuard)
@Roles(UserRole.Admin)
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async get(@Headers('x-user-id') userId: string, @Body() userQueryDto: UserQueryDto): Promise<any> {
    return this.userService.getProfiles(userQueryDto);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string): Promise<UserProfileDto> {
    return this.userService.getProfileById(id);
  }

  @Patch(':id')
  async updateProfile(@Param('id') id: string, @Body() userUpdateDto: UpdateUserDto): Promise<UserProfileDto> {
    return this.userService.updateProfile(id, userUpdateDto);
  }
}
