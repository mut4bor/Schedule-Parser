import React from 'react'
import * as style from './style.module.scss'

type SkeletonProps = React.HTMLAttributes<HTMLSpanElement> & {
  // Add any custom props here if needed
}

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
  const { className, ...otherProps } = props
  return <span ref={ref} className={`${style.skeletonRoot} ${className}`} {...otherProps} />
})
