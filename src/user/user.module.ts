import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepo } from './user.repo';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepo],
  controllers: [UserController],
  exports: [UserRepo],
})
export class UserModule {}
