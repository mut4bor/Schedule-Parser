import * as style from './style.module.scss'
import { Schedule } from '@/widgets/schedule'
import {
  useGetGroupByIDQuery,
  useUpdateGroupByIDMutation,
} from '@/shared/redux'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RefreshDate } from '@/widgets/refresh-date'
import { GroupHeading } from '@/entities/group'
import { ErrorComponent } from '@/widgets/error'
import { Options } from '@/widgets/options'
import { EditableItem } from '@/widgets/editable-item'

const CreateTapStopPropagationHandler = () =>
  useSwipeable({
    onTap: (event) => {
      event.event.stopPropagation()
    },
  })

interface Props {
  groupID: string
  pickedWeek: string
  pickedDayIndex: number
}

export const GroupInfo = ({ groupID, pickedWeek, pickedDayIndex }: Props) => {
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

  const toggleOptionsList = () => setIsOptionsListVisible((prev) => !prev)

  const optionsStopPropagationHandler = CreateTapStopPropagationHandler()

  const { data: groupData } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  const [updateGroup] = useUpdateGroupByIDMutation()

  if (!groupID) {
    return (
      <ErrorComponent
        error={{
          status: 500,
          data: { message: 'Invalid groupID' },
        }}
      />
    )
  }

  return (
    <div className={style.schedule}>
      <div className={style.headingContainer}>
        <div>
          <EditableItem
            value={groupData?.group ?? ''}
            crudHandlers={{
              onUpdate: async (_, newValue) => {
                if (!groupID) return
                await updateGroup({
                  id: groupID,
                  data: { group: newValue },
                }).unwrap()
              },
            }}
          >
            <GroupHeading>{groupData?.group}</GroupHeading>
          </EditableItem>
        </div>

        <Options
          groupID={groupID}
          isOptionsListVisible={isOptionsListVisible}
          toggleOptionsList={toggleOptionsList}
          {...optionsStopPropagationHandler}
        />
      </div>

      <Schedule
        groupID={groupID}
        pickedDayIndex={pickedDayIndex}
        pickedWeek={pickedWeek}
      />

      <RefreshDate date={groupData?.updatedAt} />
    </div>
  )
}
