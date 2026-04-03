import { RoleGuard, Roles, UserRole } from "@e-ticaret/role";
import { Body, Controller, Get, Post, Headers, UseGuards, HttpCode, HttpStatus} from "@nestjs/common";
import { LoginAuthDto } from "./dtos/auth.login.dto";
import { User } from "../user/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dtos/auth.register.dto";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";

@Controller('')
@UseGuards(RoleGuard)
export class AuthController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginAuthDto): Promise<any> {
    return await this.authService.login(loginDto);
  }

  /*@Post('logout')
  async logout(): Promise<any> {
    return "Logout successful";
  }*/

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  @Post('admin/register')
  @Roles(UserRole.Admin)
  async adminRegister(@Body() registerDto: RegisterAuthDto, @Body("role") role: string): Promise<any> {
    return await this.authService.registerAsAdmin(registerDto, role);
  }
}
