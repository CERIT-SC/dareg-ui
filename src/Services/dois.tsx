import { DaregAPIObjectBase, DaregAPIResponse } from '../types/global'
import { datacite_api } from './api_datacite'

export type Doi = {
  id: string,
  attributes: {
    state: string
  }
}

const OBJECT_NAME = 'dois'

export const doisApi = datacite_api.injectEndpoints({
  endpoints: (build) => ({

    newDoi: build.mutation<{success: boolean, dataset_id: string}, {dataset_id: string}>({
      query(body) {
        return {
          url: `${OBJECT_NAME}/`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: (response) => [{ type: 'Dois', id: response?.dataset_id }],
    }),

    getDoi: build.query<Doi, string>({
      query: (dataset_id) => {
        return { url: `${OBJECT_NAME}`, params: {dataset_id}}
      },
      providesTags: (_post, _err, dataset_id) => [{ type: 'Dois', id: dataset_id }],
    }),

    finalizeDoi: build.mutation<{success: boolean, dataset_id: string}, {dataset_id: string}>({
      query(body) {
        return {
          url: `${OBJECT_NAME}/`,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (response) => [{ type: 'Dois', id: response?.dataset_id }],
    }),

  }),
})

export const {
    useNewDoiMutation,
    useGetDoiQuery,
    useFinalizeDoiMutation
} = doisApi

export const {
  endpoints: { newDoi, getDoi, finalizeDoi },
} = doisApi
