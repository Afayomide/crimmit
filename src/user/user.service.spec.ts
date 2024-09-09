// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UserService],
//     }).compile();

//     service = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  // Mock data
  const mockUser = { email: 'test@test.com', username: 'testuser', password: 'password' };
  const mockHashedPassword = '$2b$10$pbtQGvDArlIrBV3wlNbDWO3rxt2zu8g5pX2X71im/e8aMf.f8iJEq'; // Example hashed password

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Simulate the create method
      const result = await service.create(mockUser.email, mockUser.username, mockUser.password);

      // Check if create was called with correct parameters
      expect(model.create).toHaveBeenCalledWith({ email: mockUser.email, username: mockUser.username, password: mockUser.password });
      expect(result).toEqual(mockUser);
    });
  });

  // Additional tests


  it('should return a user by ID', async () => {
    const mockUser = { _id: 'someId', email: 'test@test.com', username: 'testuser', password: 'password' };
    
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);

    const result = await service.findById('someId');
    expect(result).toEqual(mockUser);
    expect(model.findById).toHaveBeenCalledWith('someId');
  });

  it('should return null if user is not found by ID', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);

    const result = await service.findById('nonExistingId');
    expect(result).toBeNull();
    expect(model.findById).toHaveBeenCalledWith('nonExistingId');
  });
});
