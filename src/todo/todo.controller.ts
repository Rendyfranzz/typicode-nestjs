import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { BaseResponse } from 'src/response/BaseResponse';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllTodos(@Req() request: Request) {
    const todos = await this.todoService.getAllTodos(request['user'].id);
    return new BaseResponse(200, 'OK', todos);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getTodoById(@Param('id') id: number) {
    const todo = await this.todoService.getTodoById(id);
    return new BaseResponse(200, 'OK', todo);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateTodo(
    @Param('id') id: number,
    @Body()
    dto: {
      completed: boolean;
    },
  ) {
    await this.todoService.completedTodo(id, dto);
    return new BaseResponse(200, 'Berhasil Mengupdate Todo');
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateTodoTitle(
    @Param('id') id: number,
    @Body()
    dto: {
      title: string;
      completed: boolean;
    },
  ) {
    await this.todoService.updateTodo(id, dto);
    return new BaseResponse(200, 'Berhasil Mengupdate Todo');
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: number) {
    const res = await this.todoService.deleteTodo(id);
    return new BaseResponse(200, res);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createTodo(
    @Req() request: Request,
    @Body()
    dto: {
      title: string;
    },
  ) {
    await this.todoService.createTodo(request['user'].id, dto);
    return new BaseResponse(200, 'Berhasil Menambahkan Todo');
  }
}
