import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { CourseButton } from '@/entities/courses'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  DeleteCourseDTO,
  UpdateCourseDTO,
} from '@/shared/redux/slices/api/coursesApi'
import { useAppSelector } from '@/shared/redux/hooks'
import routes from '@/shared/routes'
import { AddItem } from '@/widgets/add-item'
import { EditableItem } from '../editable-item'
import { ModalForm } from '../modal-form'
import { Modal } from '../modal'
import { ModalInput } from '../modal-input'

export const Courses = () => {
  const navigate = useNavigate()
  const { educationType, faculty, course } = useParams()

  const accessToken = useAppSelector((store) => store.auth.accessToken)

  const searchParams = new URLSearchParams({
    educationType: educationType ?? '',
    faculty: faculty ?? '',
  }).toString()

  const { data: coursesData } = useGetCoursesQuery(searchParams, {
    skip: !educationType || !faculty,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [createCourse] = useCreateCourseMutation()
  const [updateCourse] = useUpdateCourseMutation()
  const [deleteCourse] = useDeleteCourseMutation()

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const course = formData.get('course') as string

    if (!course || !faculty) return

    try {
      await createCourse({
        name: course,
        facultyId: faculty,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании курса:', err)
    }
  }

  const handleUpdateCourse = async (args: UpdateCourseDTO) => {
    try {
      await updateCourse(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении курса:', err)
    }
  }

  const handleDeleteCourse = async (args: DeleteCourseDTO) => {
    try {
      await deleteCourse(args).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении курса:', err)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!educationType || educationType === 'undefined' || !faculty || faculty === 'undefined') {
      navigate(routes.BASE_URL)
    }

    if (!coursesData?.length) return

    if (course && coursesData.find((courseItem) => courseItem.name === course)) return

    navigate(
      `/educationTypes/${educationType}/faculties/${faculty}/courses/${coursesData[0]._id}`,
      {
        replace: true,
      },
    )
  }, [course, coursesData, educationType, faculty, navigate])

  return (
    <ul className={style.list}>
      {!coursesData
        ? Array.from({ length: 4 }).map((_, index) => (
            <li className={style.listElement} key={index}>
              <Skeleton className={style.skeleton} />
            </li>
          ))
        : coursesData.map((course, index) => (
            <li className={style.listElement} key={index}>
              <EditableItem
                value={course.name}
                type="number"
                min={1}
                max={6}
                crudHandlers={{
                  onUpdate: (newValue) =>
                    handleUpdateCourse({
                      id: course._id,
                      name: newValue,
                      facultyId: faculty ?? '',
                    }),
                  onDelete: () => handleDeleteCourse({ id: course._id }),
                }}
              >
                <CourseButton course={course} />
              </EditableItem>
            </li>
          ))}

      {accessToken && (
        <AddItem addButtonLabel="Добавить курс" isAdding={isModalOpen} setIsAdding={setIsModalOpen}>
          <Modal onClose={handleCancel}>
            <ModalForm onSubmit={handleCreateCourse} onCancel={handleCancel}>
              <ModalInput label="Добавить курс:" name="course" defaultValue="" type="number" />
            </ModalForm>
          </Modal>
        </AddItem>
      )}
    </ul>
  )
}
