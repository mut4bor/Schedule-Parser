import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema(
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
      type: Object,
      required: [true, 'Please enter dates'],
    },
    index: {
      type: Number,
      required: [true, 'Please enter index'],
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model('Group', groupSchema)
