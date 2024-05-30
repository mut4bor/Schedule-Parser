import { Header } from '@/entities/header'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MainPage } from './main'
import { GroupPage } from './group'
import { ErrorPage } from './error'
import { BASE_URL } from '@/shared/config'
import { store } from '@/shared/redux'

export const Routing = () => {
  const router = createBrowserRouter([
    {
      path: BASE_URL,
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
      path: `${BASE_URL}/:groupId`,
      element: (
        <>
          <Header />
          <GroupPage />
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
