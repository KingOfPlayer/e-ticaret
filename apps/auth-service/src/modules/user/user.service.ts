import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { LoggerService } from '@e-ticaret/logger';
import { CreateUserDto } from './dtos/user.create.dto';
import { UserProfileDto } from './dtos/user.profile.dto';
import { UpdateUserDto } from './dtos/user.update.dto';
import { UserQueryDto } from './dtos/user.query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private loggerService: LoggerService,
  ) {}

  private async EncryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async create(
    createUserDto: CreateUserDto,
    role: string,
  ): Promise<User> {
    const existing = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existing) {
      throw new ConflictException('This email is already registered.');
    }

    const hashedPassword = await this.EncryptPassword(createUserDto.password);
    const createdUser = await this.userModel.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      surname: createUserDto.surname,
      role: role,
    });

    return createdUser;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    return this.create(createUserDto, 'user');
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    return this.create(createUserDto, 'admin');
  }

  async createModerator(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    return this.create(createUserDto, 'moderator');
  }

  async findById(userId: string): Promise<UserProfileDto> {
    const user = await this.userModel.findById(userId);
    return {
      name: user!.name,
      surname: user!.surname,
      email: user!.email,
      address: user!.address,
      phone: user!.phone,
    };
  }

  async update(
    userId: string,
    userUpdateDto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    if (userUpdateDto.password) {
      userUpdateDto.password = await this.EncryptPassword(
        userUpdateDto.password,
      );
    }
    const user = await this.userModel.findByIdAndUpdate(userId, userUpdateDto, {
      new: true,
    });
    return {
      name: user!.name,
      surname: user!.surname,
      email: user!.email,
      address: user!.address,
      phone: user!.phone,
    };
  }

  async findAll(query: UserQueryDto): Promise<UserProfileDto[]> {
    const filter: any = {};
    if (query.email) {
      filter.email = query.email;
    }
    if (query.name) {
      filter.name = query.name;
    }
    if (query.surname) {
      filter.surname = query.surname;
    }
    const users = await this.userModel.find(filter).exec();
    return users;
  }
}
