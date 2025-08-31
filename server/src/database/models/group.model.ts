import mongoose, { Schema, Document } from 'mongoose'

export interface ISchedule {
  [week: string]: {
    [day: string]: {
      [time: string]: string
    }
  }
}

export interface IGroup extends Document {
  educationType: string
  faculty: string
  course: string
  group: string
  dates: Map<string, { [day: string]: { [time: string]: string } }>
}

const groupSchema = new Schema<IGroup>(
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
      type: Map,
      of: new Schema(
        {
          // день недели
          // например: "monday", "tuesday"
          // внутри — объект с ключами времени
          // например: "09:00": "Math"
        },
        { strict: false, _id: false },
      ),
      default: {},
    },
  },
  { timestamps: true },
)

export const Group = mongoose.model<IGroup>('Group', groupSchema)
