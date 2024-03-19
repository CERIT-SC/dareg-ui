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
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetProfileQuery,
    useGetErrorProneQuery,
} = profileApi

export const {
    endpoints: { getProfile, getErrorProne },
} = profileApi
