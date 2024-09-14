import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BaseResponse } from 'src/response/BaseResponse';

// Create a mock implementation for AuthService
const mockAuthService = {
  getUser: jest.fn(),
  addUser: jest.fn(),
  getValidUser: jest.fn(),
  generateJWT: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('addUser', () => {
    it('should return 400 if user already exists', async () => {
      const dto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      // Mock behavior of getUser to return an existing user
      (authService.getUser as jest.Mock).mockResolvedValue(dto);

      const result = await controller.addUser(dto);

      expect(result).toEqual(new BaseResponse(400, 'User already exist', null));
      expect(authService.getUser).toHaveBeenCalledWith(dto.email);
    });

    it('should create and return new user if not exists', async () => {
      const dto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };

      // Mock behavior of getUser to return null
      (authService.getUser as jest.Mock).mockResolvedValue(null);
      // Mock behavior of addUser to return the created user
      (authService.addUser as jest.Mock).mockResolvedValue(dto);

      const result = await controller.addUser(dto);

      expect(result).toEqual(new BaseResponse(200, 'OK', dto));
      expect(authService.getUser).toHaveBeenCalledWith(dto.email);
      expect(authService.addUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should return user and JWT tokens on successful login', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
      };
      const jwt = { accessToken: 'accessToken', refreshToken: 'refreshToken' };

      // Mock behavior of getValidUser and generateJWT
      (authService.getValidUser as jest.Mock).mockResolvedValue(user);
      (authService.generateJWT as jest.Mock).mockResolvedValue(jwt);

      const result = await controller.login(dto);

      expect(result).toEqual(new BaseResponse(200, 'OK', { user, jwt }));
      expect(authService.getValidUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(authService.generateJWT).toHaveBeenCalledWith(user);
    });
  });
});
