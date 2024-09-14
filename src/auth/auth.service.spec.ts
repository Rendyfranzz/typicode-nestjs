/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepo } from './auth.repo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { InvalidCredentialsError } from 'src/exception/invalidCredentials.error';

describe('AuthService', () => {
  let service: AuthService;
  let authRepo: AuthRepo;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockAuthRepo = {
    findOneByEmail: jest.fn(),
    addUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepo, useValue: mockAuthRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepo = module.get<AuthRepo>(AuthRepo);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getUser', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      mockAuthRepo.findOneByEmail.mockResolvedValue(user);

      const result = await service.getUser('test@example.com');
      expect(result).toEqual(user);
      expect(mockAuthRepo.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });

  describe('getValidUser', () => {
    it('should return a valid user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      } as User;
      mockAuthRepo.findOneByEmail.mockResolvedValue(user);

      const result = await service.getValidUser('test@example.com', 'password');
      expect(result).toEqual(user);
      expect(mockAuthRepo.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw InvalidCredentialsError if user not found', async () => {
      mockAuthRepo.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.getValidUser('test@example.com', 'password'),
      ).rejects.toThrow(InvalidCredentialsError);
    });

    it('should throw InvalidCredentialsError if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      } as User;
      mockAuthRepo.findOneByEmail.mockResolvedValue(user);

      await expect(
        service.getValidUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });

  describe('generateJWT', () => {
    it('should return access and refresh tokens', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
      } as User;
      mockJwtService.signAsync
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.generateJWT(user);
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_REFRESH');
    });
  });
});
