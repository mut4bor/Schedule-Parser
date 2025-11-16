import { baseApi } from '@/shared/redux/slices/baseApi'

export interface EducationType {
  name: string
  _id: string
}

export interface CreateEducationTypeDTO {
  name: string
}

export interface UpdateEducationTypeDTO {
  id: string
  name: string
}

export interface DeleteEducationTypeDTO {
  id: string
}

export const educationTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEducationTypes: builder.query<EducationType[], void>({
      query: () => `/education-types`,
      providesTags: ['EducationTypes'],
    }),
    createEducationType: builder.mutation<{ message: string }, CreateEducationTypeDTO>({
      query: (body) => ({
        url: `/education-types`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    updateEducationType: builder.mutation<{ message: string }, UpdateEducationTypeDTO>({
      query: ({ id, name }) => ({
        url: `/education-types/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteEducationType: builder.mutation<{ message: string }, DeleteEducationTypeDTO>({
      query: ({ id }) => ({
        url: `/education-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetEducationTypesQuery,
  useCreateEducationTypeMutation,
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
} = educationTypesApi
