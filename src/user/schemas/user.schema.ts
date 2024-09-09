import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  email: {type: String, unique: true, required: true},
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export interface User extends Document {
  id: string;  
  email: string;
  username: string;
  password: string;  

}
