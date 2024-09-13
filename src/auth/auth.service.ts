import { Injectable } from '@nestjs/common';
import { AuthRepo } from './auth.repo';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsError } from 'src/exception/invalidCredentials.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepo,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(email: string) {
    const res = await this.authRepo.findOneByEmail(email);
    return res;
  }

  async getValidUser(email: string, password: string) {
    const user = await this.authRepo.findOneByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError(email);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new InvalidCredentialsError(email);
    }

    return user;
  }

  async generateJWT(payload: User) {
    const payloads = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      name: payload.name,
    };
    const accessToken = await this.jwtService.signAsync(payloads, {
      subject: payload.id.toString(),
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
      issuer: this.configService.get('JWT_ISSUER'),
    });

    const refreshToken = await this.jwtService.signAsync(payloads, {
      subject: payload.id.toString(),
      secret: this.configService.get('JWT_REFRESH'),
      expiresIn: '7d',
      issuer: this.configService.get('JWT_ISSUER'),
    });
    return { accessToken, refreshToken };
  }

  async addUser(dto: RegisterDto) {
    const hassedPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hassedPassword;
    const res = await this.authRepo.addUser(dto);
    return res;
  }
}
