import { User } from 'src/user/entities/user.entity';

export class CreateTodoDto {
  title: string;
  completed: boolean;
  user: User;
}
