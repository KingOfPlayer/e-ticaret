import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { LoggerService } from '@e-ticaret/logger';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {}

  async register(registerDto: any): Promise<any> {
    const { email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanımda.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
    });

    await user.save();
    return {
      id: user._id,
      email: user.email,
      message: 'Kayıt başarıyla tamamlandı.',
    };
  }

  async login(loginDto: any): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre.');
    }

    const payload = { userId: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
  health(): any {
    this.loggerService.log(
      'Health check endpoint accessed',
      'AppService.health',
    );
    return { status: 'ok' };
  }
}
