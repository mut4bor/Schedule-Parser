import * as style from './style.module.scss'
import { forwardRef } from 'react'

type SkeletonProps = React.HTMLAttributes<HTMLSpanElement> & {
  // Add any custom props here if needed
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const { className, ...otherProps } = props
    return (
      <span
        ref={ref}
        className={`${style.skeletonRoot} ${className}`}
        {...otherProps}
      />
    )
  },
)
