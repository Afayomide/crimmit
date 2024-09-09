import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(email: string, username: string, password: string): Promise<any> {
    const existingUserByEmail = await this.userService.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email is already registered');
    }

    const existingUserByUsername = await this.userService.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await this.userService.create(email, username, hashedPassword);
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { username: user.username };
      const token = jwt.sign(payload, 'my_jwt_secret', { expiresIn: '1h' });
      return { accessToken: token };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
