import mongoose, { Schema } from 'mongoose'
import { IGroup, ILesson } from '@/types/index.js'

const lessonSchema = new Schema<ILesson>(
  {
    time: { type: String, required: true },
    classroom: { type: String, required: true },
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
      default: null,
      validate: {
        validator: function (v) {
          return v === null || v.trim().length > 0
        },
        message: 'Тип образования не может быть пустым',
      },
    },
    faculty: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || v.trim().length > 0
        },
        message: 'Факультет не может быть пустым',
      },
    },
    course: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || v.trim().length > 0
        },
        message: 'Курс не может быть пустым',
      },
    },
    groupName: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || v.trim().length > 0
        },
        message: 'Группа не может быть пустой',
      },
    },
    dates: {
      type: Map,
      of: [[lessonSchema]],
      default: {},
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
