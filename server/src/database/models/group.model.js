import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema(
  {
    group: {
      type: Number,
      required: [true, 'Please enter group number'],
    },
    date: {
      type: Object,
      required: [true, 'Please enter date'],
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model('Group', groupSchema)
