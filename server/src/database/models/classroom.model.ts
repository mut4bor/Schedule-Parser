import mongoose, { Schema } from 'mongoose'

const classroomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

classroomSchema.index({ name: 1 }, { unique: true })

export const Classroom = mongoose.model('Classroom', classroomSchema)
