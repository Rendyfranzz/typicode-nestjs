import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthRepo extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async addUser(user: RegisterDto): Promise<User> {
    const res = await this.userRepository.save(user);
    return res;
  }

  async findOneByEmail(email: string): Promise<User> {
    const res = await this.userRepository.findOne({
      where: { email: email },
    });
    return res;
  }
}
