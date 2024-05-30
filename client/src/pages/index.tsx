import { Header } from '@/entities/header'
import { store } from '@/shared/redux/store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BASE_URL } from '@/shared/config'
import { MainPage } from './main'
import { GroupPage } from './group'
import { ErrorPage } from './error'

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
