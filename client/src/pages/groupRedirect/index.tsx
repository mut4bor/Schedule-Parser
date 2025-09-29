import { useNavigate, useParams } from 'react-router-dom'
import { useGetGroupByIDQuery } from '@/shared/redux'
import { useEffect } from 'react'

export const GroupRedirectPage = () => {
  const { groupID = '' } = useParams()

  const navigate = useNavigate()

  const { data: groupData } = useGetGroupByIDQuery(groupID, {
    skip: !groupID,
  })

  useEffect(() => {
    if (!groupData) {
      return
    }

    navigate(
      `/educationTypes/${groupData.educationType}/faculties/${groupData.faculty}/courses/${groupData.course}/groups/${groupData._id}`,
      { replace: true },
    )
  }, [groupData, navigate])

  return null
}
