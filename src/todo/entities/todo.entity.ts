import { User } from 'src/user/entities/user.entity';
import { DefaultEntity } from 'src/utils/entities/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Todo extends DefaultEntity {
  @Column()
  title: string;

  @Column()
  completed: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: User;
}
