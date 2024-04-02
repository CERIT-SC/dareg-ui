import { DaregAPIObjectBase, DaregAPIResponse } from '../types/global'
import { onedata_api } from './api_onedata'
import { Facility } from './facilities'
import { Schema } from './schemas'

type Pair<T> = ['name' | 'file_id' | 'mode' | 'size' | 'hard_links_count' | 'atime' | 'mtime' | 'ctime' | 'owner_id' | 'parent_id' | 'provider_id' | 'storage_user_id' | 'storage_group_id' | 'shares' | 'index' | 'type' | 'children', T]
type Pairs<T> = Pair<T>[]

export type File = Pairs<string | number | string[] | 'DIR' | 'REG' | null>
export type Files = {
  files: [
    ['name', string],
    ['file_id', string],
    ['mode', string],
    ['size', number],
    ['hard_links_count', number],
    ['atime', string],
    ['mtime', string],
    ['ctime', string],
    ['owner_id', string],
    ['parent_id', string],
    ['provider_id', string],
    ['storage_user_id', string],
    ['storage_group_id', string],
    ['shares', string[]],
    ['index', string],
    ['type', 'DIR | FILE | REG'],
    ['children',  | null]
  ]

}

const OBJECT_NAME = 'files'

export const filesApi = onedata_api.injectEndpoints({
  endpoints: (build) => ({
    getFiles: build.query<Files, string>({
      query: (dataset_id) => ({ url: `${OBJECT_NAME}/?dataset_id=${dataset_id}` }),
      providesTags: ['Files'],
    })
  }),
})

export const {
    useGetFilesQuery
} = filesApi

export const {
  endpoints: { getFiles },
} = filesApi
