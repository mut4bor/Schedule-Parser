import { IGroup, IName } from 'shared/redux/slices/types'

export type PaginationButtonProps = {
  data: {
    groupData: IGroup
    namesData: IName[]
  }
  buttonType: 'increase' | 'decrease'
}
