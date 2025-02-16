import { TeacherSearchInput } from '@/entities/teacher-search'
import * as style from './style.module.scss'
import { useState } from 'react'

export const TeacherSearchPage = () => {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className={style.container}>
      <TeacherSearchInput
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
      />
    </div>
  )
}
