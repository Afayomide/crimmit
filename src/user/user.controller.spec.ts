import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser = { email: 'test@test.com', username: 'testuser', password: 'password' };

  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          return true; 
        },
      })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const body = { email: 'test@test.com', username: 'testuser', password: 'password' };
      const result = await controller.create(body);

      expect(userService.create).toHaveBeenCalledWith(body.email, body.username, body.password);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = 'someId';
      const result = await controller.getUserById(userId);

      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'nonExistingId';
      jest.spyOn(userService, 'findById').mockResolvedValueOnce(null);

      await expect(controller.getUserById(userId)).rejects.toThrow(NotFoundException);
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });
  });
});
