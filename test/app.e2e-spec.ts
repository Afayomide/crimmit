import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserService } from './../src/user/user.service';
import { JwtAuthGuard } from './../src/auth/jwt-auth.guard'; 


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});


describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService = { create: jest.fn(), findById: jest.fn() };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };



  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)      
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) should create a user', () => {
    const mockUser = { email: 'test@test.com', username: 'testuser', password: 'password' };
    userService.create.mockResolvedValueOnce(mockUser);

    return request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201)
      .expect(mockUser);
  });

  it('/users/:id (GET) should return a user by id', () => {
    const mockUser = { _id: 'someId', email: 'test@test.com', username: 'testuser' };
    userService.findById.mockResolvedValueOnce(mockUser);

    return request(app.getHttpServer())
      .get('/users/someId')
      .expect(200)
      .expect(mockUser);
  });

  it('/users/:id (GET) should return 404 if user not found', () => {
    userService.findById.mockResolvedValueOnce(null);

    return request(app.getHttpServer())
      .get('/users/nonExistingId')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      });
  });
});
