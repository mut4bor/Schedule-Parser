import { Header } from '@/widgets/header'
import { FavoriteButton } from '@/entities/favorite'
import { MainPage } from './main'
import { CoursesPage } from './courses'
import { GroupIDPage } from './groupID'
import { ErrorPage } from './error'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { BASE_URL, COURSES_PATH, GROUP_ID_PATH } from '@/shared/config'
import { store } from '@/shared/redux'
import { Icons } from '@/shared/icons'

export const Routing = () => {
  const router = createBrowserRouter([
    {
      path: `${BASE_URL}`,
      element: (
        <>
          <Header />
          <MainPage />
        </>
      ),
      errorElement: (
        <>
          <Header />
          <ErrorPage />
        </>
      ),
    },

    {
      path: `${BASE_URL}${COURSES_PATH}`,
      element: (
        <>
          <Header />
          <CoursesPage />
        </>
      ),
      errorElement: (
        <>
          <Header />
          <ErrorPage />
        </>
      ),
    },
    {
      path: `${BASE_URL}${GROUP_ID_PATH}`,
      element: (
        <>
          <Header />
          <GroupIDPage />
        </>
      ),
      errorElement: (
        <>
          <Header />
          <ErrorPage />
        </>
      ),
    },
  ])

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Icons />
      </Provider>
    </>
  )
}
