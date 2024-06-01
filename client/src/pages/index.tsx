import { Header } from '@/entities/header'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { EducationTypesPage } from './educationTypes'
import { FacultiesPage } from './faculties'
import { CoursesPage } from './courses'
import { GroupsPage } from './groups'
import { GroupIDPage } from './groupID'
import { ErrorPage } from './error'
import { BASE_URL } from '@/shared/config'
import { store } from '@/shared/redux'

export const Routing = () => {
  const router = createBrowserRouter([
    {
      path: `${BASE_URL}`,
      element: (
        <>
          <Header />
          <EducationTypesPage />
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
      path: `${BASE_URL}/:educationType`,
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
      path: `${BASE_URL}/:educationType/:faculty`,
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
      path: `${BASE_URL}/:educationType/:faculty/:course`,
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
      path: `${BASE_URL}/:educationType/:faculty/:course/:groupID`,
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
