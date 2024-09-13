import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoRepo } from './todo.repo';
import { AxiosHelper } from 'src/infra/axios-helper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepo } from 'src/user/user.repo';
import { User } from 'src/user/entities/user.entity';
import { CacheService } from 'src/infra/cache';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get('JWT_SECRET'),
        };
      },
    }),
  ],
  providers: [TodoService, TodoRepo, AxiosHelper, UserRepo, CacheService],
  controllers: [TodoController],
  exports: [TodoService],
})
export class TodoModule {}
