import { useState } from 'react'
import {
  useGetAllTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  ITeacher,
} from '@/shared/redux/slices/api/teachersApi'
import * as style from './style.module.scss'

export const TeachersPage = () => {
  const { data: teachers, isLoading } = useGetAllTeachersQuery()
  const [addTeacher] = useCreateTeacherMutation()
  const [updateTeacher] = useUpdateTeacherMutation()
  const [deleteTeacher] = useDeleteTeacherMutation()

  const [formData, setFormData] = useState<Partial<ITeacher>>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.middleName) return

    if (editingId) {
      await updateTeacher({ ...formData, id: editingId })
    } else {
      await addTeacher({
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        title: formData.title,
      })
    }

    setFormData({})
    setEditingId(null)
  }

  const handleEdit = (teacher: ITeacher) => {
    setFormData(teacher)
    setEditingId(teacher._id)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Удалить преподавателя?')) {
      await deleteTeacher({ id })
    }
  }

  if (isLoading) return <div>Загрузка...</div>

  return (
    <div className={style.container}>
      <h1>Преподаватели</h1>

      <form onSubmit={handleSubmit} className={style.form}>
        <input
          type="text"
          placeholder="Имя"
          value={formData.firstName || ''}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={formData.lastName || ''}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Отчество"
          value={formData.middleName || ''}
          onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Титул"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Отмена
          </button>
        )}
      </form>

      <ul className={style.list}>
        {teachers?.map((teacher) => (
          <li key={teacher._id} className={style.item}>
            <span>
              {teacher.lastName} {teacher.firstName} {teacher.middleName} —{' '}
              {teacher.title || 'Без должности'}
            </span>
            <div className={style.actions}>
              <button onClick={() => handleEdit(teacher)}>✏️ Редактировать</button>
              <button onClick={() => handleDelete(teacher._id)}>🗑️ Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
