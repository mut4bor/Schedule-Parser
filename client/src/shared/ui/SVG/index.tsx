type SVGProps = {
  href: string
  svgClassName?: string
  useClassName?: string
}

export function SVG(props: SVGProps) {
  return (
    <svg className={props.svgClassName}>
      <use className={props.useClassName} xlinkHref={props.href} />
    </svg>
  )
}
