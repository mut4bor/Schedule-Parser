import { ISchedule } from '@/shared/redux/slices/types'

export type DaysListProps = {
  toggleIsGroupDaysVisible: () => void
  isGroupDaysVisible: boolean
  scheduleData?: ISchedule
}
