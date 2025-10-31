import mongoose, { Schema } from 'mongoose'

export interface ITeacher {
  firstName: string
  middleName: string
  lastName: string
  title: string
}

const teacherSchema = new Schema<ITeacher>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true },
)

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema)
