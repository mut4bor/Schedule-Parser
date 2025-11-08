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
import { EditableItem } from '@/widgets/editable-item'
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

  const handleUpdateGroup = async ({
    id,
    educationType,
    faculty,
    course,
    name,
  }: UpdateGroupDTO) => {
    if (!educationType || !faculty || !course) return
    try {
      await updateGroupByID({
        id,
        educationType,
        faculty,
        course,
        name,
      }).unwrap()
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
            <EditableItem
              value={groupData.name}
              crudHandlers={{
                onUpdate: async (name) => handleUpdateGroup({ id: groupData._id, name }),
              }}
            >
              <GroupHeading>{groupData.name}</GroupHeading>
            </EditableItem>
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
