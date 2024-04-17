import { DaregAPIObjectBase, DaregAPIResponse, UserData } from '../types/global'
import { api } from './api'

export type UsersResponse = DaregAPIResponse<UserData>

const OBJECT_NAME = 'users'

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersResponse, number>({
      query: (page = 1) => ({ url: `${OBJECT_NAME}/?page=${page}` }),
      providesTags: (result = {} as UsersResponse) => [
        ...result.results.map(({ id }) => ({ type: 'Users', id } as const)),
        { type: 'Users' as const, id: 'LIST' },
      ],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetUsersQuery,
    useGetErrorProneQuery,
} = usersApi

export const {
    endpoints: { getUsers, getErrorProne },
} = usersApi
