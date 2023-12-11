import { DaregAPIObjectBase, DaregAPIResponse } from '../types/global'
import { api } from './api'
import { Facility } from './facilities'
import { Schema } from './schemas'

export type Project = DaregAPIObjectBase & {
  name: string
  description: string
  default_dataset_schema: string
  project_schema: string
  metadata: Object
  facility: string
}

export type ProjectsResponse = DaregAPIResponse<Project>

const OBJECT_NAME = 'projects'

export type ProjectResponse = DaregAPIResponse<Project> & Exclude<Project, 'metadata' | 'default_dataset_schema' | 'project_schema' | 'facility'> & {
  facility: DaregAPIObjectBase & Facility,
  default_dataset_schema: Pick<Schema, 'name' | 'id'>,
  project_template: Pick<Schema, 'name' | 'id'>,
  project_filled_template: {template: Schema},
}

export const projectsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<ProjectsResponse, number>({
      query: (page = 1) => ({ url: `${OBJECT_NAME}/?page=${page}` }),
      providesTags: (result = {} as ProjectsResponse) => [
        ...result.results.map(({ id }) => ({ type: 'Projects', id } as const)),
        { type: 'Projects' as const, id: 'LIST' },
      ],
    }),
    addProject: build.mutation<ProjectResponse, Partial<Project>>({
      query: (body) => ({
        url: 'projects/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    getProject: build.query<ProjectResponse, string>({
      query: (id) => `${OBJECT_NAME}/${id}`,
      providesTags: (_post, _err, id) => [{ type: 'Projects', id }],
    }),
    updateProject: build.mutation<ProjectResponse, Partial<Project>>({
      query(data) {
        const { id, ...body } = data
        return {
          url: `${OBJECT_NAME}/${id}/`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: (project) => [{ type: 'Projects', id: project?.id }],
    }),
    deleteProject: build.mutation<{ success: boolean; id: string }, number>({
      query(id) {
        return {
          url: `${OBJECT_NAME}/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (project) => [{ type: 'Projects', id: project?.id }],
    }),
    getErrorProne: build.query<{ success: boolean }, void>({
      query: () => 'error-prone',
    }),
  }),
})

export const {
    useGetProjectsQuery,
    useAddProjectMutation,
    useGetProjectQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetErrorProneQuery,
} = projectsApi

export const {
    endpoints: { getProjects, addProject, updateProject, deleteProject, getErrorProne },
} = projectsApi

export const {
  endpoints: { getProject },
} = projectsApi
