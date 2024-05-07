import { DaregAPIMinimalNestedObject, DaregAPIObjectBase, DaregAPIResponse } from '../types/global'
import { api } from './api'

export type Dataset = DaregAPIObjectBase & {
  name: string,
  description: string,
  schema: string | DaregAPIMinimalNestedObject,
  metadata: Object,
  project: string | DaregAPIMinimalNestedObject
  tags: string[],
  onedata_file_id: string
}

export type DatasetRequest = {
  id?: string,
  name: string,
  description: string,
  metadata: Object,
  project: string,
  schema: string,
  one_data_file_id?: string
}

export type DatasetsResponse = DaregAPIResponse<Dataset>

const OBJECT_NAME = 'datasets'

export const datasetsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDatasets: build.query<DatasetsResponse, {page: number, projId: string | undefined}>({
      query: ({page, projId} : {page: number, projId: string | undefined}) => ({ url: `${OBJECT_NAME}/?page=${page}${projId ? "&project=".concat(projId) : ""}` }),
      providesTags: (result = {} as DatasetsResponse) => [
        ...result.results.map(({ id }) => ({ type: 'Datasets', id } as const)),
        { type: 'Datasets' as const, id: 'LIST' },
      ],
    }),
    addDataset: build.mutation<DatasetsResponse, DatasetRequest>({
      query: (body) => ({
        url: `${OBJECT_NAME}/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Datasets', id: 'LIST' }],
    }),
    getDataset: build.query<Dataset, string>({
      query: (id) => `${OBJECT_NAME}/${id}`,
      providesTags: (_post, _err, id) => [{ type: 'Datasets', id }],
    }),
    updateDataset: build.mutation<Dataset, DatasetRequest>({
      query(data) {
        const { id, ...body } = data
        return {
          url: `${OBJECT_NAME}/${id}/`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: (dataset) => [{ type: 'Datasets', id: dataset?.id }],
    }),
    deleteDataset: build.mutation<{ success: boolean; id: string }, number>({
      query(id) {
        return {
          url: `${OBJECT_NAME}/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (dataset) => [{ type: 'Datasets', id: dataset?.id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetDatasetsQuery,
    useAddDatasetMutation,
    useGetDatasetQuery,
    useUpdateDatasetMutation,
    useDeleteDatasetMutation,
    useGetErrorProneQuery,
} = datasetsApi

export const {
    endpoints: { getDatasets, addDataset, updateDataset, deleteDataset, getErrorProne },
} = datasetsApi
