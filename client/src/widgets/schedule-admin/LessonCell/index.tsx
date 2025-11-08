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
  isValidLessonType,
  UpdateLessonDTO,
} from '@/shared/redux/slices/api/scheduleApi'

interface Props {
  group: {
    id: string
    name: string
  }
  lesson: ILesson
  scheduleID: string
  weekName: string
  dayIndex: number
  lessonIndex: number
  onAdd: (args: CreateLessonDTO) => Promise<void>
  onUpdate: (args: UpdateLessonDTO) => Promise<void>
  onDelete: (args: DeleteLessonDTO) => Promise<void>
}

export const LessonCell = ({
  group,
  lesson,
  scheduleID,
  weekName,
  dayIndex,
  lessonIndex,
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

    if (!isValidLessonType(lessonType)) {
      return
    }

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
          lesson={lesson}
          scheduleID={scheduleID}
          dayIndex={dayIndex}
          lessonIndex={lessonIndex}
          onUpdate={onUpdate}
          onDelete={
            weekName !== 'even' && weekName !== 'odd' ? (args) => onDelete(args) : undefined
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
