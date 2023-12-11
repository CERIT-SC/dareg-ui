import { DaregAPIObjectBase, DaregAPIResponse } from '../types/global'
import { api } from './api'
import { Schema } from './schemas'

export type Facility = DaregAPIObjectBase & {
  name: string
  abbreviation: string,
}

export type FacilitiesResponse = DaregAPIResponse<Facility>

const OBJECT_NAME = 'facilities'

export const facilitiesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getFacilities: build.query<FacilitiesResponse, number>({
      query: (page = 1) => ({ url: `${OBJECT_NAME}/?page=${page}` }),
      providesTags: (result = {} as FacilitiesResponse) => [
        ...result.results.map(({ id }) => ({ type: 'Facilities', id } as const)),
        { type: 'Facilities' as const, id: 'LIST' },
      ],
    }),
    addFacility: build.mutation<FacilitiesResponse, Partial<Facility>>({
      query: (body) => ({
        url: `${OBJECT_NAME}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Facilities', id: 'LIST' }],
    }),
    getFacility: build.query<Facility, string>({
      query: (id) => `${OBJECT_NAME}/${id}`,
      providesTags: (_post, _err, id) => [{ type: 'Facilities', id }],
    }),
    updateFacility: build.mutation<Facility, Partial<Facility>>({
      query(data) {
        const { id, ...body } = data
        return {
          url: `${OBJECT_NAME}/${id}`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: (facility) => [{ type: 'Facilities', id: facility?.id }],
    }),
    deleteFacility: build.mutation<{ success: boolean; id: string }, number>({
      query(id) {
        return {
          url: `${OBJECT_NAME}/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (facility) => [{ type: 'Facilities', id: facility?.id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetFacilitiesQuery,
    useAddFacilityMutation,
    useGetFacilityQuery,
    useUpdateFacilityMutation,
    useDeleteFacilityMutation,
    useGetErrorProneQuery,
} = facilitiesApi

export const {
    endpoints: { getFacilities, addFacility, updateFacility, deleteFacility, getErrorProne },
} = facilitiesApi
