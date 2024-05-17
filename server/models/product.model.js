import mongoose from 'mongoose'

const groupSchema = mongoose.Schema(
  {
    group: {
      type: Number,
      required: [true, 'Please enter group number'],
    },
    date: {
      type: String,
      required: [true, 'Please enter date'],
    },
  },
  { timeStemps: true },
)

export const Group = mongoose.model('Group', groupSchema)
