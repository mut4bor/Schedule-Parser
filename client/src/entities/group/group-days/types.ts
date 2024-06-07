import { IGroup } from '@/shared/redux'

export type GroupDaysProps = {
  data?: IGroup
  handleState: (state: boolean) => void
  state: boolean
}
