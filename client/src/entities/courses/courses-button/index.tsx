import * as style from './style.module.scss'
import { Link, useParams } from 'react-router-dom'

interface Props {
  course: string
}

export const CourseButton = ({ course }: Props) => {
  const { educationType, faculty, course: pickedCourse } = useParams()

  return (
    <Link
      to={`/educationTypes/${educationType}/faculties/${faculty}/courses/${course}`}
      className={`${style.link} ${pickedCourse === course ? style.active : ''}`}
    >
      {course} курс
    </Link>
  )
}
