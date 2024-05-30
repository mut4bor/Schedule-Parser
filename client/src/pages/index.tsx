import { Header } from '@/entities/header'
import { store } from '@/shared/redux/store'
import { Provider } from 'react-redux'
import { MainPage } from './main'
import { GroupPage } from './group'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BASE_URL } from '@/shared/config'

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
    },
    {
      path: `${BASE_URL}/:groupId`,
      element: (
        <>
          <Header />
          <GroupPage />{' '}
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
