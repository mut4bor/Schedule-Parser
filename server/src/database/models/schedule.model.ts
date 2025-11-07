import mongoose, { Schema } from 'mongoose'

const scheduleSchema = new Schema(
  {
    week: {
      type: Schema.Types.ObjectId,
      ref: 'Week',
      required: true,
    },
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
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
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

scheduleSchema.index({ week: 1, group: 1 })
scheduleSchema.index({ week: 1, teacher: 1 })

export const Schedule = mongoose.model('Schedule', scheduleSchema)
