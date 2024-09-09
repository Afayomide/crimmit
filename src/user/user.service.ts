import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema'; // Adjust import if needed
import { MongooseModule } from '@nestjs/mongoose';


@Injectable()
export class UserService {
//   constructor(@InjectModel(UserSchema.constructor.name) private readonly userModel: Model<User>) {}
constructor(@InjectModel('User') private readonly userModel: Model<User>) {}  // 'User' should match the name used in MongooseModule.forFeature()


  async create(email: string, username: string, password: string): Promise<User> {
    const newUser = new this.userModel({ email, username, password });
    console.log(newUser)
    return newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }


  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
