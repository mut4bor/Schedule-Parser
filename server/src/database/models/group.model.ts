import mongoose, { Schema } from 'mongoose'
import { IGroup, ILesson } from '@/types/index.js'

const teacherSchema = new Schema(
  {
    firstName: { type: String, required: false },
    middleName: { type: String, required: false },
    lastName: { type: String, required: false },
    title: { type: String },
  },
  { _id: false },
)

const lessonSchema = new Schema<ILesson>(
  {
    time: { type: String, required: false },
    classroom: { type: String, required: false },
    teacher: { type: teacherSchema, required: false },
    subject: { type: String, required: false },
    lessonType: { type: String, required: false },
  },
  { _id: true },
)

const groupSchema = new Schema<IGroup>(
  {
    educationType: {
      type: String,
      default: '',
      required: [true, 'Please enter educationType'],
    },
    faculty: {
      type: String,
      default: '',
      required: [true, 'Please enter faculty'],
    },
    course: {
      type: String,
      default: '',
      required: [true, 'Please enter course'],
    },
    group: {
      type: String,
      default: '',
      required: [true, 'Please enter group number'],
    },
    dates: {
      type: Map,
      of: {
        type: [[lessonSchema]],
        required: true,
        default: [],
      },
      default: {},
      required: true,
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
