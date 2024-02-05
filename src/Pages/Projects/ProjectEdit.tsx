import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Chip, Skeleton, Stack, TextField } from "@mui/material";
import { Add, Edit, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import TemplateSelect from "../../Components/TemplateSelect";
import { LoadingButton } from "@mui/lab";
import DaregTable, { Column } from "../../Components/EntityTable/EntityTable";
import { DaregAPIResponse, ProjectsData } from "../../types/global";
import { ViewModes } from "../../types/enums";
import { useGetSchemaQuery, useGetSchemasQuery } from "../../Services/schemas";
import { useAddProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from "../../Services/projects";
import { useGetFacilitiesQuery } from "../../Services/facilities";
import { Dataset, useGetDatasetsQuery } from "../../Services/datasets";
import DateTimeFormatter from "../../Components/DateTimeFormatter";

export type ProjectDataStateKeys = keyof ProjectsData;

const ProjectEdit = ({mode}: {mode: ViewModes}) => {

    const navigate = useNavigate();
    const { projectId } = useParams();

    const {data: facilities} = useGetFacilitiesQuery(1) // TODO: Implement pagination
    
    const [data, setData] = useState<ProjectsData>({name: "", description: "", default_dataset_schema: "", project_schema: undefined, metadata: {}, facility: facilities?.results[0].id})
    const {data: schemas, isLoading} = useGetSchemasQuery(1) // TODO: Implement pagination
    
    const templateData = useGetSchemaQuery(data.default_dataset_schema as string).data

    const [ page, setPage ] = useState(1)
    const {data: datasets} = useGetDatasetsQuery({page: page, projId: projectId}, {skip: projectId===undefined})

    const [loadingState, setLoadingState] = useState<boolean>(false)

    const [ loadingButtonState, setLoadingButtonState ] = useState<boolean>(false)

    const projectData = useGetProjectQuery(projectId as string).data
    useEffect(() => {
        if ((mode===ViewModes.Edit||mode===ViewModes.View) && projectData)
            setData({
                ...projectData, 
                default_dataset_schema: projectData.default_dataset_schema!==null ? projectData.default_dataset_schema.id : "", 
                facility: projectData.facility.id!==null ? projectData.facility.id : "",
            } as ProjectsData)
    }, [projectData])

    const [
        addProject,
        { isLoading: isUpdating },
    ] = useAddProjectMutation()

    const [ updateProject ] = useUpdateProjectMutation()
            
    const saveForm = (): void => {
        let updatedProject;
        setLoadingButtonState(true);
        const requestData = {
            ...data, 
            default_dataset_schema: data.default_dataset_schema!==undefined ? data.default_dataset_schema : null,
            facility: data.facility!==undefined ? data.facility : null,
        }
        switch(mode){
            case ViewModes.Edit:
                updatedProject = updateProject(data)
                break;
            case ViewModes.New:
                updatedProject = addProject(data)
                break;
        }
        updatedProject?.then((response) => {
        setLoadingButtonState(false)
        navigate(`/collections/${(response as {data: {id: string}}).data.id}`)
        })
    }

    const handleChange = (inputId: ProjectDataStateKeys, e: any): void => {
        if(!inputId){ 
            return 
        }
        setData({
            ...data,
            [inputId]: typeof(e)==="string" ? e : e.target.value
        })
    }
    
    const datasetsTable: Column<Dataset>[] = [
        { id: 'name', label: 'Name', minWidth: 200 },
        { id: 'description', label: 'Description', minWidth: 400 },
        { id: 'tags', label: 'Tags', minWidth: 100, renderCell: (params: any) => (params.tags?.map((item: string, index: number) => (<Chip label={item} size="small" variant="outlined" />)) || "None") },
        { id: 'created_by', label: 'Creator', minWidth: 200, renderCell: (params: any) => (params.created_by?.full_name || "Unknown")},
        { id: 'created', label: 'Creation', minWidth: 200, renderCell: (params: any) => <DateTimeFormatter>{params.created}</DateTimeFormatter>},
        { id: 'actions', label: 'Actions', minWidth: 50, renderCell: (params: any) => (
            <Button variant="contained" size="small" onClick={() => navigate(`/collections/${projectId}/datasets/${params.id}`)}>View</Button>
        )}
    ]

    if (data){
        return (
            <Box>
                <ContentHeader title={`Collection: ${mode}`} actions={
                            mode===ViewModes.View ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/collections/${data?.id}/edit`)}>
                                Edit
                            </Button>) : <></>
                        }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Collection name"
                            fullWidth
                            variant="outlined"
                            value={data?.name}
                            onChange={(e) => handleChange("name", e)}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                        <TextField
                            margin="dense"
                            label="Collection description"
                            fullWidth
                            variant="outlined"
                            value={data?.description}
                            onChange={(e) => handleChange("description", e)}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                    </Stack>
                </ContentHeader>
                {mode===ViewModes.View ? (
                    <ContentCard title={"Datasets"} actions={
                        <>
                            {/* <TextField size="small" id="dataset-search" 
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchRounded></SearchRounded></InputAdornment>,
                              }}/> */}
                            <Button variant={"contained"} size="medium" endIcon={<Add />} onClick={() => navigate(`/collections/${data?.id}/datasets/new`)}>
                                New Dataset
                            </Button>
                        </>
                    }>
                        <DaregTable
                            columns={datasetsTable}
                            data={datasets || {results: []} as unknown as DaregAPIResponse<Dataset>}
                            size="small"
                            page={page}
                            setPage={setPage}
                        />
                    </ContentCard>
                ) : <></>}
                
                {mode===ViewModes.View || !facilities ? <></> : (<ContentCard title={"Select facility"}>
                    <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                        <TemplateSelect label="" selectedId={data.facility as string} setSelectedId={(value) => handleChange("facility", value)} entities={facilities}/>
                    </Stack>
                </ContentCard>)}

                {mode===ViewModes.View || !schemas ? <></> : (<ContentCard title={"Select default template"}>
                    <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                        <TemplateSelect label="" selectedId={data.default_dataset_schema as string} setSelectedId={(value) => handleChange("default_dataset_schema", value)} entities={schemas}/>
                    </Stack>
                </ContentCard>)}

                {/* <ContentCard title={"Preview"}>
                    {(true) ? 
                    <FormsWrapped readonly schema={templateData?.schema || {}} uischema={templateData?.uischema || {}} data={{}} setData={() => {}} />
                    : <>No schema defined, use "Edit templates" section</>}
                </ContentCard> */}
                {mode===ViewModes.View ? <></> : (<ContentCard paperProps={{variant: "elevation", elevation: 0}} sx={{mb: 2, p: 0}}>
                    <LoadingButton
                        loading={loadingButtonState}
                        loadingPosition="end"
                        endIcon={<Save />}
                        variant="contained"
                        size="large"
                        onClick={() => saveForm()}
                        >
                        Save
                    </LoadingButton>
                </ContentCard>)}
                {/* {error ? <Typography variant="subtitle1">{error.message || ""}</Typography> : <p></p>} */}
            </Box>
        )
    } else {
        return (
            <Box>
                <ContentHeader title={`Template: ${mode}`} actions={
                    <Skeleton>
                        <Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => {}}>
                            Edit
                        </Button>
                    </Skeleton>
                    }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <Skeleton width={"33%"}>
                            <TextField
                            autoFocus
                            margin="dense"
                            label="Template name"
                            fullWidth
                            variant="outlined"
                            value={""}
                            disabled={true}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            />
                        </Skeleton>
                        <Skeleton width={"67%"}>
                        <TextField
                            margin="dense"
                            label="Template description"
                            fullWidth
                            variant="outlined"
                            value={""}
                            disabled={true}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            />
                        </Skeleton>
                    </Stack>
                </ContentHeader>
                <ContentCard title={"Form"}>
                    <Skeleton />
                </ContentCard>
            </Box>
        )
    }
}

export default ProjectEdit