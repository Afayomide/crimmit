import { Controller, Post, Get, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: { email: string, username: string, password: string }) {
    return this.userService.create(body.email, body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
      
    }
    return user;
  }
}
