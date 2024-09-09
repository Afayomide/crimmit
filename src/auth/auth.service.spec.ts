import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = { email: 'test@test.com', username: 'testuser', password: 'password' };
  const mockHashedPassword = '$2b$10$pbtQGvDArlIrBV3wlNbDWO3rxt2zu8g5pX2X71im/e8aMf.f8iJEq'; // Example hashed password
  const mockToken = 'some-access-token';

  const mockUserService = {
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue(mockToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    // Mock bcrypt.hash and compare
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashedPassword);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      mockUserService.findByEmail.mockResolvedValue(null); // No existing user
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await service.register(mockUser.email, mockUser.username, mockUser.password);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(userService.create).toHaveBeenCalledWith(mockUser.email, mockUser.username, mockHashedPassword); // Check for hashed password
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email is already registered', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser); // Existing user

      await expect(service.register(mockUser.email, mockUser.username, mockUser.password))
        .rejects
        .toThrow(new ConflictException('Email is already registered'));
    });
  });

  describe('login', () => {
    it('should successfully login a user and return a token', async () => {
      mockUserService.findByUsername.mockResolvedValue({ ...mockUser, password: mockHashedPassword });

      const result = await service.login(mockUser.username, mockUser.password);

      expect(userService.findByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(jwtService.sign).toHaveBeenCalledWith({ username: mockUser.username }, 'my_jwt_secret', { expiresIn: '1h' });
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(service.login(mockUser.username, mockUser.password))
        .rejects
        .toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUserService.findByUsername.mockResolvedValue({ ...mockUser, password: '$2b$10$incorrecthashedpassword' });

      // Mock bcrypt.compare to return false for incorrect password
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(mockUser.username, mockUser.password))
        .rejects
        .toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });
});
