import { Header } from '@/widgets/header'
import { TabBar } from '@/widgets/tab-bar'
import { ErrorPage } from './error'
import { MainPage } from './main'
import { CoursesPage } from './courses'
import { GroupIDPage } from './groupID'
import { FavoritePage } from './favorite'
import { TeacherSearchPage } from './teacher-search'
import { RefreshPage } from './refresh'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import routes from '@/shared/routes'
import { store } from '@/shared/redux'
import { Icons } from '@/shared/icons'

const routesArray = [
  { path: `${routes.BASE_URL}`, Component: MainPage },
  { path: `${routes.BASE_URL}${routes.COURSES_PATH}`, Component: CoursesPage },
  {
    path: `${routes.BASE_URL}${routes.FAVORITE_PATH}`,
    Component: FavoritePage,
  },
  { path: `${routes.BASE_URL}${routes.GROUP_ID_PATH}`, Component: GroupIDPage },
  {
    path: `${routes.TEACHER_SEARCH_PATH}`,
    Component: TeacherSearchPage,
  },
  {
    path: `${routes.REFRESH_PATH}`,
    Component: RefreshPage,
  },
]

export const Routing = () => {
  const router = createBrowserRouter(
    routesArray.map(({ path, Component }) => ({
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
