import { ISchedule } from '@/shared/redux/types'

export type DaysListProps = {
  scheduleData: ISchedule | undefined
  toggleIsGroupDaysVisible: () => void
  isGroupDaysVisible: boolean
}
