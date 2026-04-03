import { RoleGuard, Roles, UserRole } from "@e-ticaret/role";
import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserProfileDto } from "./dtos/user.profile.dto";
import { UpdateUserDto } from "./dtos/user.update.dto";

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  async getProfileById(@Headers('x-user-id') userId: string): Promise<any> {
    return this.userService.getProfileById(userId);
  }

  @Patch()
  async updateProfile(@Headers('x-user-id') userId: string, @Body() userUpdateDto: UpdateUserDto): Promise<any> {
    return this.userService.updateProfile(userId, userUpdateDto);
  }

  @Get('/:id')
  @Roles(UserRole.Admin)
  async getProfileByIdAdmin(@Param('id') id: string): Promise<any> {
    return this.userService.getProfileById(id);
  }

   @Patch('/:id')
   @Roles(UserRole.Admin)
   async updateProfileAdmin(@Param('id') id: string, @Body() userUpdateDto: UpdateUserDto): Promise<any> {
     return this.userService.updateProfile(id, userUpdateDto);
   }
}
