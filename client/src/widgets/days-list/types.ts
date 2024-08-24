import { ISchedule } from '@/shared/redux/slices/types'

export type DaysListProps = {
  scheduleData: ISchedule | undefined
  toggleIsGroupDaysVisible: () => void
  isGroupDaysVisible: boolean
}
