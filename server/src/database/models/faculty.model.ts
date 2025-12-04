import mongoose, { Schema } from 'mongoose'

const facultySchema = new Schema(
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
  },
  { timestamps: true },
)

facultySchema.index({ name: 1, educationType: 1 }, { unique: true })

export const Faculty = mongoose.model('Faculty', facultySchema)
