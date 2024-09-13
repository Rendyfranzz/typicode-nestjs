import { Injectable } from '@nestjs/common';
import { TodoRepo } from './todo.repo';
import { AxiosHelper } from 'src/infra/axios-helper';

import { CreateTodoDto } from './dto/create.dto';
import { UserRepo } from 'src/user/user.repo';
import { CacheService } from 'src/infra/cache';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepo: TodoRepo,
    private readonly userRepo: UserRepo,
    private readonly axiosService: AxiosHelper<{
      title?: string;
      completed?: boolean;
    }>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllTodos(id: number) {
    const resaxios = await this.axiosService.get('/todos');
    console.log('resaxios:', resaxios);
    const cachedTodos = await this.cacheService.get('todos');
    if (cachedTodos) {
      return JSON.parse(cachedTodos);
    }
    console.log('Fetching from DB');

    const res = await this.todoRepo.findAllByUserId(id);
    await this.cacheService.set('todos', JSON.stringify(res));
    return res;
  }

  async getTodosFromAxios() {
    const cachedTodos = await this.cacheService.get('todosAxios');
    if (cachedTodos) {
      return JSON.parse(cachedTodos);
    }
    console.log('Fetching from Axios');
    const res = await this.axiosService.get('/todos');
    await this.cacheService.set('todosAxios', JSON.stringify(res));
    return res;
  }

  async getTodoById(id: number) {
    const cachedTodo = await this.cacheService.get(`todo-${id}`);
    if (cachedTodo) {
      return JSON.parse(cachedTodo);
    }
    console.log('Fetching from DB');
    const res = await this.todoRepo.findOneById(id);
    await this.cacheService.set(`todo-${id}`, JSON.stringify(res));

    return res;
  }

  async createTodo(
    userId: number,
    todo: {
      title: string;
    },
  ) {
    const user = await this.userRepo.findOneById(userId);
    const todoReq: CreateTodoDto = {
      title: todo.title,
      user: user,
      completed: false,
    };
    const postTodo = await this.axiosService.post('/todos', {
      title: todo.title,
    });
    console.log('Post todo axios:', postTodo);
    const res = await this.todoRepo.add(todoReq);

    await this.cacheService.del('todos');
    return res;
  }

  async completedTodo(
    id: number,
    dto: {
      completed: boolean;
    },
  ) {
    const todo = await this.todoRepo.findOneById(id);
    todo.completed = dto.completed;
    const resAxios = await this.axiosService.updateCompleted(`/todos/${id}`, {
      completed: dto.completed,
    });
    console.log('resAxios:', resAxios);
    const res = await this.todoRepo.updateTodo(todo);

    await this.cacheService.del(`todo-${id}`);
    console.log('res:', res);
    return res;
  }

  async updateTodo(
    id: number,
    dto: {
      title: string;
      completed: boolean;
    },
  ) {
    const todo = await this.todoRepo.findOneById(id);
    todo.title = dto.title;
    todo.completed = dto.completed;
    const resAxios = await this.axiosService.update(`/todos/${id}`, {
      title: dto.title,
      completed: dto.completed,
    });
    console.log('resAxios:', resAxios);
    const res = await this.todoRepo.updateTodo(todo);

    await this.cacheService.del(`todo-${id}`);
    return res;
  }

  async deleteTodo(id: number) {
    const todo = await this.todoRepo.findOneById(id);
    if (!todo) {
      return 'Todo not found';
    }
    const resAxios = await this.axiosService.delete(`/todos/${id}`);
    console.log('resAxios:', resAxios);
    await this.todoRepo.delete(id);
    return 'Todo deleted';
  }
}
