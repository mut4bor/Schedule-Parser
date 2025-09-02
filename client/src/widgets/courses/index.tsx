import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { CourseButton } from '@/entities/courses'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from '@/shared/redux'
import routes from '@/shared/routes'
import { AddItem } from '@/widgets/add-item'
import { EditableItem } from '../editable-item'

export const Courses = () => {
  const navigate = useNavigate()
  const { educationType, faculty, course } = useParams()

  useEffect(() => {
    if (
      !educationType ||
      educationType === 'undefined' ||
      !faculty ||
      faculty === 'undefined'
    ) {
      navigate(routes.BASE_URL)
    }
  }, [educationType, faculty, navigate])

  const searchParams = new URLSearchParams({
    educationType: educationType ?? '',
    faculty: faculty ?? '',
  }).toString()

  const { data: coursesData } = useGetCoursesQuery(searchParams, {
    skip: !educationType || !faculty,
  })

  const [createCourse] = useCreateCourseMutation()
  const [updateCourse] = useUpdateCourseMutation()
  const [deleteCourse] = useDeleteCourseMutation()

  const handleCreateCourse = async (newCourse: string) => {
    if (!newCourse || !educationType || !faculty) return
    try {
      await createCourse({
        educationType,
        faculty,
        course: newCourse,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при создании курса:', err)
    }
  }

  const handleUpdateCourse = async (oldCourse: string, newCourse: string) => {
    try {
      await updateCourse({ oldCourse, newCourse }).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении курса:', err)
    }
  }

  const handleDeleteCourse = async (course: string) => {
    if (!educationType || !faculty) return

    try {
      await deleteCourse({
        educationType,
        faculty,
        course,
      }).unwrap()
    } catch (err) {
      console.error('Ошибка при удалении курса:', err)
    }
  }

  const crudHandlers = {
    onUpdateCourse: handleUpdateCourse,
    onDeleteCourse: handleDeleteCourse,
  }

  useEffect(() => {
    if (!!coursesData && coursesData.length > 0) {
      navigate(
        `/educationTypes/${educationType}/faculties/${faculty}/courses/${
          !!course ? course : coursesData[0]
        }`,
        { replace: true },
      )
    }
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
                value={course}
                type="number"
                min={1}
                max={6}
                crudHandlers={{
                  onUpdate: (_, newValue) =>
                    crudHandlers.onUpdateCourse(course, newValue),
                  onDelete: () => crudHandlers.onDeleteCourse(course),
                }}
              >
                <CourseButton course={course} />
              </EditableItem>
            </li>
          ))}

      <AddItem type="number" min={1} max={6} onAdd={handleCreateCourse}>
        Добавить курс
      </AddItem>
    </ul>
  )
}
