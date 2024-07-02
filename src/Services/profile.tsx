import { DaregAPIObjectBase, DaregAPIResponse, ProfileData } from '../types/global'
import { api } from './api'

export type ProfileResponse = DaregAPIResponse<ProfileData>

const OBJECT_NAME = 'profile'

export const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ProfileResponse, number>({
      query: (page = 1) => ({ url: `${OBJECT_NAME}/?page=${page}` }),
      providesTags: (result = {} as ProfileResponse) => [
        ...result.results.map(({ id }) => ({ type: 'Profile', id } as const)),
        { type: 'Profile' as const, id: 'LIST' },
      ],
    }),
    updateProfile: build.mutation<ProfileData, Partial<ProfileData>>({
      query(data) {
        const { id, ...body } = data
        return {
          url: `${OBJECT_NAME}/${id}/`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: (profile) => [{ type: 'Profile', id: profile?.id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetErrorProneQuery,
} = profileApi

export const {
    endpoints: { getProfile, updateProfile, getErrorProne },
} = profileApi
