import mongoose, { Schema } from 'mongoose'

const courseSchema = new Schema(
  {
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
  },
  { timestamps: true },
)

courseSchema.index({ name: 1, educationType: 1 }, { unique: true })

export const Course = mongoose.model('Course', courseSchema)
