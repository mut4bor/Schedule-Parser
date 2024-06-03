import { Header } from '@/entities/header'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MainPage } from './main'
import { FacultiesPage } from './faculties'
import { CoursesPage } from './courses'
import { GroupsPage } from './groups'
import { GroupIDPage } from './groupID'
import { ErrorPage } from './error'
import { BASE_URL, FACULTIES_PATH, COURSES_PATH, GROUPS_PATH, GROUP_ID_PATH } from '@/shared/config'
import { store } from '@/shared/redux'

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
      path: `${BASE_URL}${FACULTIES_PATH}`,
      element: (
        <>
          <Header />
          <FacultiesPage />
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
      path: `${BASE_URL}${GROUPS_PATH}`,
      element: (
        <>
          <Header />
          <GroupsPage />
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
      </Provider>
    </>
  )
}
