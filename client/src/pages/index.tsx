import { Header } from '@/widgets/header'
import { TabBar } from '@/widgets/tab-bar'
import { ErrorPage } from './error'
import { MainPage } from './main'
import { CoursesPage } from './courses'
import { GroupIDPage } from './groupID'
import { FavoritePage } from './favorite'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import routes from '@/shared/routes'
import { store } from '@/shared/redux'

const routesArray = [
  { path: routes.BASE_URL, Component: MainPage },
  {
    path: routes.COURSES_PATH,
    Component: CoursesPage,
  },
  {
    path: `${routes.COURSES_PATH}/:course`,
    Component: CoursesPage,
  },
  {
    path: routes.FAVORITE_PATH,
    Component: FavoritePage,
  },
  { path: routes.GROUP_PATH, Component: GroupIDPage },
  { path: `/groups/:groupID`, Component: GroupIDPage },
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
    </Provider>
  )
}
