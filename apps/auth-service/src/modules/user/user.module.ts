import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserSeedService } from './user.seed.service';
import { UserAdminController } from './user.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, UserAdminController],
  providers: [UserService, UserSeedService],
  exports: [UserService, MongooseModule]
})
export class UserModule { }
