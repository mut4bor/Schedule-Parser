import mongoose, { Schema, Document } from 'mongoose'

export interface ITeacher {
  firstName: string
  middleName?: string
  lastName: string
  title?: string
}

export interface ILesson {
  classroom: string
  teacher: ITeacher
  subject: string
  lessonType: string
}

export interface ISchedule {
  [week: string]: {
    [day: string]: {
      [time: string]: ILesson
    }
  }
}

export interface IGroup extends Document {
  educationType: string
  faculty: string
  course: string
  group: string
  dates: Map<string, { [day: string]: { [time: string]: ILesson } }>
}

// --- Schemas ---
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

// DaySchema: ключи = время, значения = Lesson
const daySchema = new Schema<Record<string, ILesson>>({}, { _id: false, strict: false })
daySchema.add({ any: { type: lessonSchema } }) // "any" ключи времени

// WeekSchema: ключи = дни, значения = DaySchema
const weekSchema = new Schema<Record<string, typeof daySchema>>({}, { _id: false, strict: false })
weekSchema.add({ any: { type: daySchema } }) // "any" ключи дней

// GroupSchema
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
      of: weekSchema, // теперь Mongoose знает, что внутри
      default: {},
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
