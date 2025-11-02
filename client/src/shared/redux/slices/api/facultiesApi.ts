import { baseApi } from '../baseApi'
import {
  IGroup,
  IFaculties,
  CreateFacultyDTO,
  UpdateFacultyDTO,
  DeleteFacultyDTO,
} from '@/shared/redux/types'

export const facultiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query<IFaculties, void>({
      query: () => `/faculty`,
      providesTags: ['Faculties'],
    }),
    getAllFaculties: builder.query<string[], void>({
      query: () => `/faculty/all`,
      providesTags: ['Faculties'],
    }),
    createFaculty: builder.mutation<IGroup, CreateFacultyDTO>({
      query: (body) => ({
        url: `/faculty`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    updateFaculty: builder.mutation<{ message: string; modifiedCount: number }, UpdateFacultyDTO>({
      query: (body) => ({
        url: `/faculty`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteFaculty: builder.mutation<{ message: string; deletedCount: number }, DeleteFacultyDTO>({
      query: ({ educationType, faculty }) => ({
        url: `/faculty/${educationType}/${faculty}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    getGroupsByFaculty: builder.query<IGroup[], string>({
      query: (faculty) => `/faculty/${faculty}/groups`,
      providesTags: ['Groups'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetFacultiesQuery,
  useGetAllFacultiesQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetGroupsByFacultyQuery,
} = facultiesApi
