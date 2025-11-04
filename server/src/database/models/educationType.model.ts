import mongoose, { Schema } from 'mongoose'

const educationTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
)

export const EducationType = mongoose.model('EducationType', educationTypeSchema)
