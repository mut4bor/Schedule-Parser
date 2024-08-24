import { Header } from '@/widgets/header'
import { TabBar } from '@/widgets/tab-bar'
import { MainPage } from './main'
import { CoursesPage } from './courses'
import { GroupIDPage } from './groupID'
import { FavoritePage } from './favorite'
import { ErrorPage } from './error'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import {
  BASE_URL,
  COURSES_PATH,
  FAVORITE_PATH,
  GROUP_ID_PATH,
} from '@/shared/routes'
import { store } from '@/shared/redux'
import { Icons } from '@/shared/icons'

const routes = [
  { path: `${BASE_URL}`, Component: MainPage },
  { path: `${BASE_URL}${COURSES_PATH}`, Component: CoursesPage },
  { path: `${BASE_URL}${FAVORITE_PATH}`, Component: FavoritePage },
  { path: `${BASE_URL}${GROUP_ID_PATH}`, Component: GroupIDPage },
]

export const Routing = () => {
  const router = createBrowserRouter(
    routes.map(({ path, Component }) => ({
      path,
      element: (
        <>
          <Header />
          <Component />
          <TabBar />
        </>
      ),
      errorElement: (
        <>
          <Header />
          <ErrorPage />
          <TabBar />
        </>
      ),
    })),
  )

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Icons />
    </Provider>
  )
}
