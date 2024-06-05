import React from 'react'
import * as style from './style.module.scss'

type SkeletonParagraphProps = React.HTMLAttributes<HTMLSpanElement>

export const SkeletonParagraph = React.forwardRef<HTMLSpanElement, SkeletonParagraphProps>(
  function SkeletonParagraph(props, ref) {
    return <span ref={ref} className={style.skeletonRoot} {...props} />
  },
)
