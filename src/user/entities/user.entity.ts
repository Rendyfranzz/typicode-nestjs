import { Todo } from 'src/todo/entities/todo.entity';
import { DefaultEntity } from 'src/utils/entities/default.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  @JoinColumn()
  todos: Todo[];
}
