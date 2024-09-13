import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

import { additionalJWTPayload } from './jwt.guard';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
        issuer: this.configService.get('JWT_ISSUER'),
      });

      if (!payload) {
        throw new UnauthorizedException();
      }

      const guest = this.excludeAdditionalJWTPayload(payload) as {
        user: User;
      };

      if (guest.user) {
        request['user'] = guest;
        return true;
      }

      throw new UnauthorizedException();
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }

  private getTokenFromHeader(request: Request): string | undefined {
    //@ts-expect-error Property 'authorization' does not exist on type 'Headers'.
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private excludeAdditionalJWTPayload(payload: JwtPayload) {
    const entries = Object.entries(payload).filter(
      ([key]) => !additionalJWTPayload.includes(key),
    );

    const finalEntries = Object.fromEntries(entries);
    return finalEntries;
  }
}
