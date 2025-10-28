import mongoose, { Schema } from 'mongoose'
import { IGroup, ILesson } from '@/types/index.js'

const lessonSchema = new Schema<ILesson>(
  {
    time: { type: String, required: true },
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: String, required: true },
    lessonType: { type: String, required: true },
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
        default: null,
      },
      default: {},
      required: true,
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
