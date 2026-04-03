import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '@e-ticaret/logger';
import { LoginAuthDto } from './dtos/auth.login.dto';
import { User } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private jwtService: JwtService,
    private loggerService: LoggerService,

    private userService: UserService,
  ) {}

  async onModuleInit() {
    
  }

  async login(loginDto: LoginAuthDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginDto.email }).exec();

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout(): Promise<any> {
    return "Logout successful";
  }

  async register(registerDto: any): Promise<any> {
    this.userService.createUser(registerDto);
  }

  async registerAsAdmin(registerDto: any, role: string): Promise<any> {
    switch(role) {
      case 'admin':
        this.userService.createAdmin(registerDto);
        break;
      case 'moderator':
        this.userService.createModerator(registerDto);
        break;
      default:
        this.userService.createUser(registerDto);
    }
  }
}