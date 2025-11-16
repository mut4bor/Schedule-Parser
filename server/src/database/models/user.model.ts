import mongoose, { Schema, Document, Model } from 'mongoose'

export type UserRole = 'superadmin' | 'admin'

export interface IUser extends Document {
  username: string
  email?: string
  passwordHash: string
  role: UserRole
  isApproved: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
      index: true,
    },
    isApproved: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
)

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
