import * as style from './style.module.scss'
import { TabBarLink } from '@/entities/tab-bar/ui/tab-bar-link'
import routes from '@/shared/routes'
import React from 'react'

export const TabBar = () => {
  const links = [
    {
      text: 'Главная',
      svgHref: '#home',
      href: routes.BASE_URL,
    },
    {
      text: 'Избранное',
      svgHref: '#heart',
      href: routes.FAVORITE_PATH,
    },
  ]

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {links.map((item, index, array) => (
          <React.Fragment key={index}>
            <li className={style.listElement}>
              <TabBarLink
                text={item.text}
                svgHref={item.svgHref}
                href={item.href}
              />
            </li>
            {index < array.length - 1 && <li className={style.pipe}></li>}
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}
