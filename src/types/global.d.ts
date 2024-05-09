import { PermissionModes } from "./enums"

export type FacilityData = {
    id?: string,
    name: string,
    abbreviation: string,
    created?: string,
    url: string,
}

export type SharesList = {id: string, name: string, perms: string}[]

export interface DaregAPIResponse<T> {
    count: number,
    next: string,
    previous: string,
    results: T[],
    perms: PermissionModes,
    shares: SharesList,
}

export type DaregAPIObjectBase = {
    id: string,
    created: string,
    modified: string,
    created_by?: {id: number, full_name: string},
    modified_by: string,
    perms: PermissionModes,
    shares: SharesList,
}

export type DaregAPIMinimalNestedObject = {
    id: string,
    name: string,
}

type DaregAPIObjectExtended = DaregAPIObjectBase & {
    name: string
}

export type Metadata = {
    url?: string,
    id?: string,
    template: string | SchemasData,
    created?: string,
    data: Object
}

export type ProjectsData = {
    id?: string,
    name: string,
    description: string,
    default_dataset_schema: string | undefined,
    project_schema: string | undefined,
    metadata: Object,
    created?: string,
    facility: string | undefined,
    perms: PermissionModes,
    shares: SharesList,
  }

export type FormData = {
    id?: string,
    template: string,
    data: string,
    created?: string,
}

export type DatasetsDataLegacy = {
    id?: string,
    name: string,
    description: string,
    dataset_schema: {id: string, name: string, url: string},
    created?: string,
    metadata: Object,
    project: {id: string, name: string, url: string},
}

export type SchemasData = {
    id?: string,
    name: string,
    description: string,
    schema: Object,
    uischema: Object,
    created?: string,
}

export type ExplorerItem = {
    id: string,
    name: string,
    upper: string,
    addDate: number, 
    modDate: number,
    size: number
}

export type UserData = {
    id: string,
    name: string,
}

export type ProfileData = {
    id: string,
    full_name: string,
    default_data_rows: number,
    any_datasets: boolean,
    any_facilities: boolean,
    any_projects: boolean,
    avatar: string,
    app_version: {
        version: string,
        date: string,
        environment: string,
    }
    last_login: string
}

module.exports = {
    DatasetsData,
    ProjectsData,
    SchemasData,
    FormData,
}