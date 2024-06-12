import * as style from './style.module.scss'
import { GroupHeadingProps } from './types'
import { Skeleton } from '@/shared/ui'
import { useState, useEffect } from 'react'
import { SkeletonTime } from '@/shared/vars/vars'

export const GroupHeading = ({ groupData }: GroupHeadingProps) => {
  const [groupHeadingSkeletonIsEnabled, setGroupHeadingSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setGroupHeadingSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [groupData])

  return (
    <>
      {!groupData || groupHeadingSkeletonIsEnabled ? (
        <Skeleton className={style.skeleton} />
      ) : (
        <p className={style.heading}>{groupData.group}</p>
      )}
    </>
  )
}
