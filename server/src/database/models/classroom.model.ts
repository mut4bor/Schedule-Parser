import mongoose, { Document, Schema } from 'mongoose'

export interface IClassroom extends Document {
  name: string
  building?: string
  floor: number
  description?: string
}

const classroomSchema = new Schema<IClassroom>(
  {
    name: { type: String, required: [true, 'Please enter classroom name'] },
    building: { type: String, default: '' },
    floor: { type: Number, default: 1 },
    description: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Classroom = mongoose.model<IClassroom>('Classroom', classroomSchema)
