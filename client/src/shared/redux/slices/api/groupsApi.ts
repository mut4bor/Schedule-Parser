import { baseApi } from '../baseApi'
import { EducationType } from '@/shared/redux/slices/api/educationTypesApi'
import { Facultie } from '@/shared/redux/slices/api/facultiesApi'
import { Course } from '@/shared/redux/slices/api/coursesApi'

const getParams = (params?: string) => (params ? `?${params}` : '')

export interface IGroup {
  educationType: Pick<EducationType, '_id' | 'name'>
  faculty: Pick<Facultie, '_id' | 'name'>
  course: Pick<Course, '_id' | 'name'>
  name: string
  _id: string
}

export interface CreateGroupDTO {
  educationType: string
  faculty: string
  course: string
  name: string
}

export interface UpdateGroupDTO {
  id: string
  educationType?: string
  faculty?: string
  course?: string
  name?: string
}

export interface DeleteGroupDTO {
  id: string
}

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGroups: builder.query<IGroup[], string | void>({
      query: (searchParams) => `/groups${getParams(searchParams ?? '')}`,
      providesTags: ['Groups'],
    }),
    getGroupByID: builder.query<IGroup, string>({
      query: (groupID) => `/groups/${groupID}`,
      providesTags: ['Groups'],
    }),
    createGroup: builder.mutation<IGroup, CreateGroupDTO>({
      query: (body) => ({
        url: `/groups`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),
    updateGroupByID: builder.mutation<IGroup, UpdateGroupDTO>({
      query: ({ id, educationType, faculty, course, name }) => ({
        url: `/groups/${id}`,
        method: 'PUT',
        body: {
          educationType,
          faculty,
          course,
          name,
        },
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),
    deleteGroupByID: builder.mutation<{ message: string }, DeleteGroupDTO>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Groups', 'Names', 'Weeks', 'Schedule'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllGroupsQuery,
  useGetGroupByIDQuery,
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
} = groupsApi
