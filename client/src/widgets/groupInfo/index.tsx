import * as style from './style.module.scss'
import { Schedule } from '@/widgets/schedule'
import {
  UpdateGroupDTO,
  useGetGroupByIDQuery,
  useUpdateGroupByIDMutation,
} from '@/shared/redux/slices/api/groupsApi'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { GroupHeading } from '@/entities/group'
import { ErrorComponent } from '@/widgets/error'
import { Options } from '@/widgets/options'
import { Skeleton } from '@/shared/ui'
import { PickedWeekType } from '@/pages/groupID'

const CreateTapStopPropagationHandler = () =>
  useSwipeable({
    onTap: (event) => {
      event.event.stopPropagation()
    },
  })

interface Props {
  groupID: string
  pickedWeek: PickedWeekType | null
  pickedDayIndex: number
}

export const GroupInfo = ({ groupID, pickedWeek, pickedDayIndex }: Props) => {
  const [isOptionsListVisible, setIsOptionsListVisible] = useState(false)

  const toggleOptionsList = () => setIsOptionsListVisible((prev) => !prev)

  const optionsStopPropagationHandler = CreateTapStopPropagationHandler()

  const { data: groupData } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  const [updateGroupByID] = useUpdateGroupByIDMutation()

  const handleUpdateGroup = async (args: UpdateGroupDTO) => {
    try {
      await updateGroupByID(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении группы:', err)
    }
  }

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
          {!groupData ? (
            <Skeleton className={style.skeleton} />
          ) : (
            <GroupHeading group={groupData} onUpdate={handleUpdateGroup} />
          )}
        </div>

        <Options
          groupID={groupID}
          isOptionsListVisible={isOptionsListVisible}
          toggleOptionsList={toggleOptionsList}
          {...optionsStopPropagationHandler}
        />
      </div>

      <Schedule groupID={groupID} pickedDayIndex={pickedDayIndex} pickedWeek={pickedWeek} />
    </div>
  )
}
