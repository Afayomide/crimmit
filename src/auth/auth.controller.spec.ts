import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock data
  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ email: 'test@test.com', username: 'testuser', password: 'password' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'some-access-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService, 
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const body = { email: 'test@test.com', username: 'testuser', password: 'password' };
      const result = await controller.register(body);

      expect(authService.register).toHaveBeenCalledWith(body.email, body.username, body.password);
      expect(result).toEqual({ email: 'test@test.com', username: 'testuser', password: 'password' });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const body = { username: 'testuser', password: 'password' };
      const result = await controller.login(body);

      expect(authService.login).toHaveBeenCalledWith(body.username, body.password);
      expect(result).toEqual({ accessToken: 'some-access-token' });
    });
  });
});
