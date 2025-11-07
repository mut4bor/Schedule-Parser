import * as style from './style.module.scss'
import { ILesson } from '@/shared/redux/types'
import { LessonListItemAdmin } from './LessonListItem'
import { AddItem } from '@/widgets/add-item'
import { ModalInput } from '@/widgets/modal-input'
import { ModalForm } from '@/widgets/modal-form'
import { useState } from 'react'
import { Modal } from '@/widgets/modal'
import {
  CreateLessonDTO,
  DeleteLessonDTO,
  UpdateLessonDTO,
} from '@/shared/redux/slices/api/scheduleApi'

interface Props {
  group: {
    id: string
    name: string
  }
  weekName: string
  dayIndex: number
  lesson: ILesson

  onAdd: (args: CreateLessonDTO) => Promise<void>

  onUpdate: (args: UpdateLessonDTO) => Promise<void>

  onDelete: (args: DeleteLessonDTO) => Promise<void>
}

export const LessonCell = ({
  group,
  weekName,
  dayIndex,
  lesson,
  onAdd,
  onUpdate,
  onDelete,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const time = formData.get('time') as string
    const classroom = formData.get('classroom') as string
    const teacherID = formData.get('teacherID') as string
    const subject = formData.get('subject') as string
    const lessonType = formData.get('lessonType') as string

    await onAdd({
      id: group.id,
      weekName,
      dayIndex,
      time,
      classroom,
      teacherID,
      subject,
      lessonType,
    })
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className={`${style.scheduleCell} ${style.lessonCell}`}>
      {!!lesson ? (
        <LessonListItemAdmin
          key={lesson._id}
          group={group}
          lesson={lesson}
          onUpdate={(args) => onUpdate({ ...args, ...group })}
          onDelete={
            weekName !== 'even' && weekName !== 'odd' ? (args) => onDelete({ ...args }) : undefined
          }
        />
      ) : (
        <AddItem addButtonLabel="Добавить" isAdding={isModalOpen} setIsAdding={setIsModalOpen}>
          <Modal onClose={handleCancel}>
            <ModalForm onSubmit={handleSave} onCancel={handleCancel}>
              <ModalInput label="Время:" name="time" defaultValue="" type="time" />
            </ModalForm>
          </Modal>
        </AddItem>
      )}
    </div>
  )
}
