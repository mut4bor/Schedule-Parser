import * as style from './style.module.scss'
import { TabBarLink } from '@/entities/tab-bar/ui/tab-bar-link'
import { BASE_URL, FAVORITE_PATH } from '@/shared/config'
import React from 'react'

export const TabBar = () => {
  const links = [
    {
      text: 'Главная',
      svgHref: '#home',
      href: BASE_URL,
    },
    {
      text: 'Избранное',
      svgHref: '#heart',
      href: FAVORITE_PATH,
    },
  ]

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {links.map((item, index, array) => (
          <React.Fragment key={index}>
            <li className={style.listElement}>
              <TabBarLink text={item.text} svgHref={item.svgHref} href={item.href} />
            </li>
            {index < array.length - 1 && <li className={style.pipe}></li>}
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}
