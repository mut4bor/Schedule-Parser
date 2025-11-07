import * as style from './style.module.scss'
import { Link, useParams } from 'react-router-dom'
import { Course } from '@/shared/redux/slices/api/coursesApi'

interface Props {
  course: Course
}

export const CourseButton = ({ course }: Props) => {
  const { educationType, faculty, course: pickedCourse } = useParams()

  return (
    <Link
      to={`/educationTypes/${educationType}/faculties/${faculty}/courses/${course}`}
      className={`${style.link} ${pickedCourse === course._id ? style.active : ''}`}
    >
      {course.name} курс
    </Link>
  )
}
