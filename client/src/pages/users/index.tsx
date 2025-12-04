import * as style from './style.module.scss'
import {
  ApproveUserDTO,
  useApproveUserMutation,
  useGetAllUsersQuery,
  useGetPendingUsersQuery,
} from '@/shared/redux/slices/api/adminApi'

export const UsersPage = () => {
  const { data: usersData } = useGetAllUsersQuery()
  const { data: pendingUsersData } = useGetPendingUsersQuery()

  const [approveUser] = useApproveUserMutation()

  const handleApproveUser = async (args: ApproveUserDTO) => {
    try {
      await approveUser(args).unwrap()
    } catch (err) {
      console.error('Ошибка при обновлении преподавателя:', err)
    }
  }

  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <h2>Пользователи для подтверждения</h2>
        {pendingUsersData?.map((user) => (
          <div className={style.user} key={user._id}>
            <p className={style.text}>
              {user.username} ({user.role})
            </p>

            <button type="button" onClick={() => handleApproveUser({ id: user._id })}>
              Подтвердить
            </button>
          </div>
        ))}
      </div>

      <div className={style.wrapper}>
        <h2>Все подтвержденные пользователи</h2>

        {usersData
          ?.filter((user) => user.isApproved)
          .map((user) => (
            <p className={style.text} key={user._id}>
              {user.username} ({user.role})
            </p>
          ))}
      </div>
    </div>
  )
}
