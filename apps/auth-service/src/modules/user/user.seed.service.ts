import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedUser();
    await this.seedModerator();
  }

  async seedAdmin() {
    const adminEmail = 'admin@ecosystem.com';
    const existing = await this.userModel.findOne({ email: adminEmail }).exec();
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userModel.create({
        email: adminEmail,
        name: 'Admin',
        surname: 'User',
        password: hashedPassword,
        role: 'admin',
      });
    }
  }

  async seedUser() {
    const userEmail = 'user@ecosystem.com';
    const existing = await this.userModel.findOne({ email: userEmail }).exec();
    if (!existing) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await this.userModel.create({
        email: userEmail,
        name: 'Test',
        surname: 'User',
        password: hashedPassword,
        role: 'user',
      });
    }
  }

  async seedModerator() {
    const moderatorEmail = 'moderator@ecosystem.com';
    const existing = await this.userModel
      .findOne({ email: moderatorEmail })
      .exec();
    if (!existing) {
      const hashedPassword = await bcrypt.hash('moderator123', 10);
      await this.userModel.create({
        email: moderatorEmail,
        name: 'Moderator',
        surname: 'User',
        password: hashedPassword,
        role: 'moderator',
      });
    }
  }
}
