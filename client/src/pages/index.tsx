import { Header } from '@/entities/header'
import { store } from '@/shared/redux/store'
import { Provider } from 'react-redux'
import { MainPage } from './main'
import { GroupPage } from './group'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

export const Routing = () => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const router = createBrowserRouter([
    {
      path: baseURL,
      element: (
        <>
          <Header />
          <MainPage />
        </>
      ),
    },
    {
      path: `${baseURL}/:groupId`,
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
