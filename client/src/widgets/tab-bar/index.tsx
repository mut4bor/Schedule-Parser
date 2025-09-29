import * as style from './style.module.scss'
import routes from '@/shared/routes'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const TabBar = () => {
  const links = [
    {
      text: 'Главная',
      svg: (
        <svg className={style.svg} viewBox="0 0 24 24">
          <g id="Sharp_3_">
            <polygon points="12,2.1 1,12 4,12 4,21 10,21 10,14 14,14 14,21 20,21 20,12 23,12 " />
          </g>
        </svg>
      ),
      href: routes.BASE_URL,
    },
    {
      text: 'Избранное',
      svg: (
        <svg className={style.svg} viewBox="0 0 512 512">
          <path d="M340.8,83C307,83,276,98.8,256,124.8c-20-26-51-41.8-84.8-41.8C112.1,83,64,131.3,64,190.7c0,27.9,10.6,54.4,29.9,74.6  L245.1,418l10.9,11l10.9-11l148.3-149.8c21-20.3,32.8-47.9,32.8-77.5C448,131.3,399.9,83,340.8,83L340.8,83z" />
        </svg>
      ),
      href: routes.FAVORITE_PATH,
    },
  ]

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {links.map((item, index, array) => (
          <Fragment key={index}>
            <li className={style.listElement}>
              <Link to={item.href} className={style.link}>
                {item.svg}
                <p>{item.text}</p>
              </Link>
            </li>
            {index < array.length - 1 && <li className={style.pipe}></li>}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}
