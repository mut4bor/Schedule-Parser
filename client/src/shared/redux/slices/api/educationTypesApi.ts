import { baseApi } from '../baseApi'
import { CreateEducationTypeDTO, UpdateEducationTypeDTO, IGroup } from '@/shared/redux/types'

export const educationTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducationTypes: builder.query<string[], void>({
      query: () => `/education-types`,
      providesTags: ['EducationTypes'],
    }),
    createEducationType: builder.mutation<IGroup, CreateEducationTypeDTO>({
      query: (body) => ({
        url: `/education-types`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    updateEducationType: builder.mutation<
      { message: string; modifiedCount: number },
      UpdateEducationTypeDTO
    >({
      query: (body) => ({
        url: `/education-types`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteEducationType: builder.mutation<{ message: string; deletedCount: number }, string>({
      query: (educationType) => ({
        url: `/education-types/${educationType}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    getGroupsByEducationType: builder.query<IGroup[], string>({
      query: (educationType) => `/education-types/${educationType}/groups`,
      providesTags: ['Groups'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetEducationTypesQuery,
  useCreateEducationTypeMutation,
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
  useGetGroupsByEducationTypeQuery,
} = educationTypesApi
