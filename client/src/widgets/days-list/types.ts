import { ISchedule } from '@/shared/redux/slices/types'

export type DaysListProps = {
  handleSetIsGroupDaysVisible: (state: boolean) => void
  isGroupDaysVisible: boolean
  scheduleData?: ISchedule
}
