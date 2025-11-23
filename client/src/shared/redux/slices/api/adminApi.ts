import { baseApi } from '@/shared/redux/slices/baseApi'

export type UserRole = 'superadmin' | 'admin'

export interface AdminUser {
  _id: string
  username: string
  role: UserRole
  isApproved?: boolean
  createdAt?: string
}

interface ApproveUserResponse {
  message: string
  user: AdminUser
}

export interface ApproveUserDTO {
  id: string
}

export interface RejectUserDTO {
  id: string
}

interface RejectUserResponse {
  message: string
}

interface ChangeRoleResponse {
  message: string
  user: AdminUser
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<AdminUser[], void>({
      query: () => ({
        url: '/admin/users',
        method: 'GET',
      }),
      providesTags: ['AdminUsers'],
    }),
    getPendingUsers: build.query<AdminUser[], void>({
      query: () => ({
        url: '/admin/users/pending',
        method: 'GET',
      }),
      providesTags: ['AdminUsers'],
    }),
    approveUser: build.mutation<ApproveUserResponse, ApproveUserDTO>({
      query: ({ id }) => ({
        url: `/admin/users/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    rejectUser: build.mutation<RejectUserResponse, RejectUserDTO>({
      query: ({ id }) => ({
        url: `/admin/users/${id}/reject`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    changeUserRole: build.mutation<ChangeRoleResponse, { id: string; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllUsersQuery,
  useGetPendingUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useChangeUserRoleMutation,
} = adminApi
