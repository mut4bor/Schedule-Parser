import React from 'react'
import * as style from './style.module.scss'

type SkeletonProps = React.HTMLAttributes<HTMLSpanElement>

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
  return <span ref={ref} className={style.skeletonRoot} {...props} />
})
