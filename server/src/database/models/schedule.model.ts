import mongoose, { Schema } from 'mongoose'
import { LessonType, TimeSlots } from '@/types/index.js'

const scheduleSchema = new Schema(
  {
    weekName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    days: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
        },
        lessons: [
          {
            time: {
              type: String,
              required: true,
              enum: TimeSlots,
            },
            classroom: {
              type: Schema.Types.ObjectId,
              ref: 'Classroom',
              required: true,
            },
            subject: {
              type: String,
              required: true,
              trim: true,
            },
            teacher: {
              type: Schema.Types.ObjectId,
              ref: 'Teacher',
              required: true,
            },
            lessonType: {
              type: String,
              required: true,
              enum: Object.values(LessonType),
            },
            description: {
              type: String,
              required: false,
              trim: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
)

scheduleSchema.index({ week: 1, group: 1 })

export const Schedule = mongoose.model('Schedule', scheduleSchema)
