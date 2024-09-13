import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BaseResponse } from 'src/response/BaseResponse';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async addUser(@Body() body: RegisterDto) {
    const isUserExist = await this.authService.getUser(body.email);
    if (isUserExist) {
      return new BaseResponse(400, 'User already exist', null);
    }
    const user = await this.authService.addUser(body);
    return new BaseResponse(200, 'OK', user);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.getValidUser(body.email, body.password);
    const jwt = await this.authService.generateJWT(user);
    return new BaseResponse(200, 'OK', {
      user,
      jwt,
    });
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async whoami(@Req() request: Request) {
    const user = request['user'];
    return new BaseResponse(200, 'OK', user);
  }
}
