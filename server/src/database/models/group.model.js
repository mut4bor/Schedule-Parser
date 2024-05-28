import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: [true, 'Please enter group number'],
    },
    date: {
      type: Object,
      required: [true, 'Please enter date'],
    },
    index: {
      type: Number,
      required: [true, 'Please enter index'],
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model('Group', groupSchema)
