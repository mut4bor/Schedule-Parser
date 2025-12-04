import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  educationType: {
    type: Schema.Types.ObjectId,
    ref: 'EducationType',
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
})

groupSchema.index({ name: 1, faculty: 1, course: 1 }, { unique: true })

export const Group = mongoose.model('Group', groupSchema)
