import mongoose, { Schema } from 'mongoose'
import { ITeacher, ILesson, IGroup } from '@/types/index.js'

const teacherSchema = new Schema<ITeacher>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    title: { type: String },
  },
  { _id: false },
)

const lessonSchema = new Schema<ILesson>(
  {
    classroom: { type: String, required: true },
    teacher: { type: teacherSchema, required: true },
    subject: { type: String, required: true },
    lessonType: { type: String, required: true },
  },
  { _id: false },
)

// День: объект, где ключи = время ("09:45"), значения = lessonSchema
const daySchema = new Schema<Record<string, ILesson>>({}, { _id: false, strict: false })

// Указываем, что значения daySchema — это lessonSchema
daySchema.add({
  // любое время (динамический ключ)
  time: { type: lessonSchema },
})

// Группа
const groupSchema = new Schema<IGroup>(
  {
    educationType: {
      type: String,
      required: [true, 'Please enter educationType'],
    },
    faculty: {
      type: String,
      required: [true, 'Please enter faculty'],
    },
    course: {
      type: String,
      required: [true, 'Please enter course'],
    },
    group: {
      type: String,
      required: [true, 'Please enter group number'],
    },
    dates: {
      type: Map,
      of: [daySchema], // ключ = "2025-W01", значение = массив дней
      default: {},
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
