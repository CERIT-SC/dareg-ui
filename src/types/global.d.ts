export type FacilityData = {
    id?: string,
    name: string,
    abbreviation: string,
    created?: string,
    url: string,
}

export interface DaregAPIResponse<T> {
    count: number,
    next: string,
    previous: string,
    results: T[],
}

export type DaregAPIObjectBase = {
    id: string,
    created: string,
    modified: string,
    created_by?: {id: number, full_name: string},
    modified_by: string,
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
    facility: string | undefined
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

module.exports = {
    DatasetsData,
    ProjectsData,
    SchemasData,
    FormData,
}