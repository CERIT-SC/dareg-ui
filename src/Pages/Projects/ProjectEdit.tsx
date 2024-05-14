import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Chip, Skeleton, Stack, Tab, TextField } from "@mui/material";
import { Add, BackHand, Edit, GroupAdd, MultipleStop, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import TemplateSelect from "../../Components/TemplateSelect";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import DaregTable, { Column } from "../../Components/EntityTable/EntityTable";
import { DaregAPIResponse, ProjectsData, SharesList } from "../../types/global";
import { ViewModes } from "../../types/enums";
import { useGetSchemaQuery, useGetSchemasQuery } from "../../Services/schemas";
import { ProjectResponse, useAddProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from "../../Services/projects";
import { useGetFacilitiesQuery } from "../../Services/facilities";
import { Dataset, useGetDatasetsQuery } from "../../Services/datasets";
import DateTimeFormatter from "../../Components/DateTimeFormatter";
import PermissionsTable from "../../Components/PermissionsContainer/PermissionsTable";
import SkeletonView from "../../Components/SkeletonView";

export type ProjectDataStateKeys = keyof ProjectsData;

const ProjectEdit = ({mode}: {mode: ViewModes}) => {

    const navigate = useNavigate();
    const { projectId, tab } = useParams();

    const {data: facilities} = useGetFacilitiesQuery(1) // TODO: Implement pagination
    
    const [data, setData] = useState<ProjectsData>({name: "", description: "", default_dataset_schema: "", project_schema: undefined, metadata: {}, facility: undefined, perms: "viewer", shares: []})
    const {data: schemas, isLoading} = useGetSchemasQuery(1) // TODO: Implement pagination
    
    const templateData = useGetSchemaQuery(data.default_dataset_schema as string).data

    const [ tabContent, setTabContent ] = useState<string>(mode===ViewModes.New ? "settigns" : tab ? tab as string : "datasets")

    const [ page, setPage ] = useState(1)
    const {data: datasets} = useGetDatasetsQuery({page: page, projId: projectId}, {skip: projectId===undefined})

    const [loadingState, setLoadingState] = useState<boolean>(false)

    const [ loadingButtonState, setLoadingButtonState ] = useState<boolean>(false)

    const [ currentShares, setCurrentShares ] = useState<SharesList>(data.shares)
    const {data: projectData, isLoading: projectDataLoading} = useGetProjectQuery(projectId as string, {skip: mode===ViewModes.New})

    useEffect(() => {
        if ((mode===ViewModes.Edit||mode===ViewModes.View) && projectData)
            setData({
                ...projectData, 
                default_dataset_schema: projectData.default_dataset_schema!==null ? projectData.default_dataset_schema.id : "", 
                facility: projectData.facility.id!==null ? projectData.facility.id : "",
            } as ProjectsData)
        if (projectData) setCurrentShares(projectData.shares)
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
                updatedProject = updateProject({...data, shares: currentShares})
                break;
            case ViewModes.New:
                updatedProject = addProject(data)
                break;
        }
        updatedProject?.then((response) => {
        setLoadingButtonState(false)
        navigate(`/collections/${(response as {data: {id: string}}).data.id}/${tabContent}`)
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

    if (!projectDataLoading){
        return (
            <Box>
                <ContentHeader title={`Collection: ${mode}`} actions={
                        data.perms!=="viewer" ?
                            mode===ViewModes.View ? (
                                <Button
                                    variant={"contained"}
                                    size="medium"
                                    endIcon={<Edit />}
                                    onClick={() => navigate(`/collections/${data?.id}/edit`)}
                                >
                                Edit
                                </Button>
                            ) : (
                                <>
                                    <LoadingButton
                                        loading={loadingButtonState}
                                        loadingPosition="end"
                                        endIcon={<Save />}
                                        variant="contained"
                                        size="medium"
                                        onClick={() => saveForm()}
                                    >
                                        Save
                                    </LoadingButton>
                                </>
                            )
                        : undefined}>
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
                <TabContext value={tabContent}>
                    {mode!==ViewModes.New ? 
                        <ContentCard>
                            <TabList onChange={(e, newValue) => {
                                    setTabContent(newValue)
                                    window.history.replaceState(null, "CEITEC Dataset Register", `/collections/${projectId}/${newValue}`)
                                }}
                                    aria-label="lab API tabs example"
                                >
                                <Tab label="Datasets" value={"datasets"} />
                                <Tab label="Settings" value={"settings"} />
                            </TabList>
                        </ContentCard>
                    : null
                    }
                    <TabPanel value="datasets" sx={{p:0}}>
                        <ContentCard title={"Datasets"} actions={
                            <>
                                {/* <TextField size="small" id="dataset-search" 
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchRounded></SearchRounded></InputAdornment>,
                                }}/> */}
                                {data.perms!=="viewer" ? 
                                <Button variant={"contained"} size="medium" endIcon={<Add />} onClick={() => navigate(`/collections/${data?.id}/datasets/new`)}>
                                    New Dataset
                                </Button> : null}
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
                    </TabPanel>
                    <TabPanel value="settings" sx={{p:0}}>
                        {!facilities ? <></> : (<ContentCard title={"Select facility"}>
                            <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                                <TemplateSelect 
                                    disabled={mode===ViewModes.View}
                                    label=""
                                    selectedId={data.facility as string}
                                    setSelectedId={(value) => handleChange("facility", value)}
                                    entities={{...facilities, results: facilities.results.filter((fac) => fac.perms != "viewer")}}
                                />
                            </Stack>
                        </ContentCard>)}
                        {!schemas ? <></> : (<ContentCard title={"Select default template"}>
                            <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                                <TemplateSelect
                                    disabled={mode===ViewModes.View}
                                    label=""
                                    selectedId={data.default_dataset_schema as string}
                                    setSelectedId={(value) => handleChange("default_dataset_schema", value)}
                                    entities={schemas}
                                />
                            </Stack>
                        </ContentCard>)}
                        {mode!==ViewModes.New ? 
                            <PermissionsTable perms={mode===ViewModes.Edit ? data.perms : "viewer"} currentShares={currentShares} setCurrentShares={setCurrentShares}/>
                        : null }
                    </TabPanel>
                </TabContext>

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
            <SkeletonView name="Collection" mode={mode} />
        )
    }
}

export default ProjectEdit