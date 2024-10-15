import mongoose, { Schema, Document } from 'mongoose';
import { hash } from 'bcryptjs';

export interface IUser extends Document {
  name: string
  email: string
  password: string
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
