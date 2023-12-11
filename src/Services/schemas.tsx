import { DaregAPIObjectBase, DaregAPIResponse } from '../types/global'
import { api } from './api'

export type Schema = DaregAPIObjectBase & {
  name: string
  description: string
  schema: Object
  uischema: Object
}

const OBJECT_NAME = 'schemas'

export const schemasApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSchemas: build.query<DaregAPIResponse<Schema>, number>({
      query: (page: number = 1) => ({ url: `${OBJECT_NAME}/?page=${page}` }),
      providesTags: (result = {} as DaregAPIResponse<Schema>) => [
        ...result.results.map(({ id }) => ({ type: 'Schemas', id } as const)),
        { type: 'Schemas' as const, id: 'LIST' },
      ],
    }),
    addSchema: build.mutation<Schema, Partial<Schema>>({
      query: (body) => ({
        url: `${OBJECT_NAME}/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Schemas', id: 'LIST' }],
    }),
    getSchema: build.query<Schema, string>({
      query: (id) => `${OBJECT_NAME}/${id}`,
      providesTags: (_post, _err, id) => [{ type: 'Schemas', id }],
    }),
    updateSchema: build.mutation<Schema, Partial<Schema>>({
      query(data) {
        const { id, ...body } = data
        return {
          url: `${OBJECT_NAME}/${id}/`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: (project) => [{ type: 'Schemas', id: project?.id }],
    }),
    deleteSchema: build.mutation<{ success: boolean; id: string }, number>({
      query(id) {
        return {
          url: `${OBJECT_NAME}/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (project) => [{ type: 'Schemas', id: project?.id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetSchemasQuery,
    useAddSchemaMutation,
    useGetSchemaQuery,
    useUpdateSchemaMutation,
    useDeleteSchemaMutation,
    useGetErrorProneQuery,
} = schemasApi

export const {
    endpoints: { getSchemas, addSchema, updateSchema, deleteSchema, getErrorProne },
} = schemasApi

export const {
  endpoints: { getSchema },
} = schemasApi
