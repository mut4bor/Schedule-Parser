import { baseApi } from '@/shared/redux/slices/baseApi'
import { setAccessToken, logout } from '@/shared/redux/slices/authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ accessToken: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: `/register`,
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation<{ accessToken: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: `/login`,
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAccessToken(data.accessToken))
        } catch {}
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(logout())
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi
