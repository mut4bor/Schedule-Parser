import mongoose, { Schema, Document } from 'mongoose'

export interface ITeacher extends Document {
  firstName: string
  middleName?: string
  lastName: string
  title?: string
}

const teacherSchema = new Schema<ITeacher>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    title: { type: String },
  },
  { timestamps: true },
)

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema)
