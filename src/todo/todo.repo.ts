import { Injectable } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create.dto';

@Injectable()
export class TodoRepo extends Repository<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {
    super(
      todoRepository.target,
      todoRepository.manager,
      todoRepository.queryRunner,
    );
  }

  async add(todo: CreateTodoDto): Promise<Todo> {
    const res = await this.todoRepository.save(todo);
    return res;
  }

  async findAll(): Promise<Todo[]> {
    const res = await this.todoRepository.find();
    return res;
  }

  async findAllByUserId(userId: number): Promise<Todo[]> {
    const res = await this.todoRepository.find({
      where: { user: { id: userId } },
    });
    return res;
  }

  async findOneById(id: number): Promise<Todo> {
    const res = await this.todoRepository.findOne({ where: { id: id } });
    return res;
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    const res = await this.todoRepository.update(todo.id, todo);
    return res.raw;
  }
}
