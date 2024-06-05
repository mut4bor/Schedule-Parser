import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import api from './slices/apiSlice'
import searchSlice from './slices/searchSlice'
import navigationSlice from './slices/navigationSlice'
import routerSlice from './slices/routerSlice'
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    navigation: navigationSlice,
    router: routerSlice,
    search: searchSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
