import mongoose, { Schema } from 'mongoose'

const scheduleSchema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    classroom: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    lessonType: {
      type: String,
      required: true,
      enum: ['Лекция', 'Практика', 'Лабораторная', 'Семинар'],
    },
  },
  { timestamps: true },
)

scheduleSchema.index({ group: 1, date: 1 })
scheduleSchema.index({ teacher: 1, date: 1 })

export const Schedule = mongoose.model('Schedule', scheduleSchema)
