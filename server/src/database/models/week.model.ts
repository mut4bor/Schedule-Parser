// models/Week.ts
import mongoose, { Schema } from 'mongoose'

const weekSchema = new Schema(
  {
    weekNumber: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

weekSchema.index({ startDate: 1, endDate: 1 })

export const Week = mongoose.model('Week', weekSchema)
