import { AccessTime, AccountCircle, Assignment, Autorenew, DataObject, Edit, GroupAdd, HomeRepairService, Save } from "@mui/icons-material";
import { Alert, Box, Button, FormControlLabel, FormGroup, Skeleton, Stack, Switch, Tab, TextField, Typography } from "@mui/material";
import ContentHeader from "../../Components/ContentHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContentCard from "../../Components/ContentCard";
import FormsWrapped, { FormsWrapperSkeleton } from "../../Components/FormsWrapped";
import useFetch from "use-http";
import { ProjectDataStateKeys } from "../Projects/ProjectEdit";
import { stringify } from 'yaml'
import { DaregAPIMinimalNestedObject, FormData, SharesList } from "../../types/global";
import { ViewModes } from "../../types/enums";
import { Dataset, DatasetRequest, useAddDatasetMutation, useGetDatasetQuery, useUpdateDatasetMutation } from "../../Services/datasets";
import { Schema, useGetSchemaQuery, useGetSchemasQuery } from "../../Services/schemas";
import { Project, useGetProjectQuery } from "../../Services/projects";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Facility } from "../../Services/facilities";
import config from "../../Config";
import FilesActiveArea from "./FilesActiveArea";
import TemplateSelect from "../../Components/TemplateSelect";
import PermissionsTable from "../../Components/PermissionsContainer/PermissionsTable";
import SkeletonView from "../../Components/SkeletonView";
import { useTranslation } from "react-i18next";

type Props = {
    mode: ViewModes
}

const DatasetView = ({mode}: Props) => {

    const { t } = useTranslation()

    const navigate = useNavigate();

    const { projectId, datasetId, tab } = useParams();

    const projectData = useGetProjectQuery(projectId as string).data
    
    const {data: datasetData, isLoading: datasetLoading} = useGetDatasetQuery(datasetId as string, {skip: mode===ViewModes.New})

    const [ tabContent, setTabContent ] = useState<string>(tab ? tab as string : "metadata")
    
    const [ data, setData ] = useState<Dataset>({name: "", description: "", schema: projectData?.default_dataset_schema ? projectData?.default_dataset_schema.id : "", project: {id: "", name: ""}, metadata: {}, shares: {}} as Dataset);

    const {data: schemas, isLoading} = useGetSchemasQuery(1) // TODO: Implement pagination

    const schema = useGetSchemaQuery(data.schema as string).data

    const [ currentShares, setCurrentShares ] = useState<SharesList>(data.shares)
    
    useEffect(() => {
        if ((mode===ViewModes.Edit||mode===ViewModes.View) && datasetData && projectData){
            setData(datasetData)
        } else {
            const dataset_schema = projectData?.default_dataset_schema ? projectData?.default_dataset_schema.id : ""
            setData({...data, project: projectData as Project, schema: dataset_schema || ""})
        }
        if (datasetData) setCurrentShares(datasetData.shares)
    }, [datasetData, projectData])

    const [ error, setError ] = useState<boolean>(false)

    const [ editorMode, setEditorMode ] = useState<"form"|"editor">("form")
    const toggleEditor = () => {
        setEditorMode((prevState) => prevState==="form" ? "editor" : "form")
    }

    const [ addDataset ] = useAddDatasetMutation()
    const [ updateDataset ] = useUpdateDatasetMutation()

    const [ loadingButtonState, setLoadingButtonState ] = useState<boolean>(false)
    const saveForm = (): void => {
        let updatedDataset;
        setLoadingButtonState(true);
        const { id, name, description, schema, project, metadata } = data;
        const datasetRequest: DatasetRequest = { name, description, schema: typeof schema === "string" ? schema : schema.id, project: typeof project === "string" ? project : project.id, metadata }
        switch(mode){
            case ViewModes.Edit:
                updatedDataset = updateDataset({...data, schema: schema as string, project: typeof data.project == "string" ? data.project : data.project.id, shares: currentShares})
                break;
            case ViewModes.New:
                updatedDataset = addDataset(datasetRequest);
                break;
        }
        updatedDataset?.then((response) => {
        setLoadingButtonState(false)
        navigate(`/collections/${projectId}/datasets/${(response as {data: Dataset}).data.id}/${tabContent}`)
        })
    }

    const handleChange = (inputId: ProjectDataStateKeys | keyof FormData | "schema", e: any): void => {
        if(!inputId){ 
            return 
        }
        setData({
            ...data,
            [inputId]: e
        })
    }

    const transform = useMemo(() => JSON.stringify(data.metadata, undefined, 4), [data.metadata])
    
    const downloadMetadata = (): void => {
        const element = document.createElement("a");
        const file = new Blob([stringify(data.metadata)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${data.name || data.id}-${(new Date()).toISOString()}.metadata.yaml`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const [autoRefresh, setAutoRefresh] = useState(true)


    if (!datasetLoading) {
        return (
            <Box>
                <ContentHeader<Dataset & Facility> title={`Dataset: ${t('mode.'+mode)}`} actions={
                            mode===ViewModes.View && data.perms!=="viewer" ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/collections/${projectId}/datasets/${datasetId}/edit`)}>
                                {t('DatasetView.edit')}
                            </Button>) : <></>
                        }
                        metadata={
                            mode === ViewModes.View ? [
                                { id: "name", value: projectData?.name ?? "", label: t('DatasetView.projectName'), icon: <Assignment /> },
                                { id: "abbreviation", value: projectData?.facility.abbreviation ?? "", label: t('DatasetView.facilityAbbreviation'), icon: <HomeRepairService /> },
                                { id: "created", value: data.created || "", label: t('DatasetView.createdAt'), icon: <AccessTime />, renderCell: (value) => (new Date(value).toLocaleString()) },
                                { id: "created_by", value: data.created_by?.full_name || "", label: t('DatasetView.author'), icon: <AccountCircle /> },
                            ] :
                            []
                        }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t('DatasetView.datasetName')}
                            fullWidth
                            required
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                        <TextField
                            margin="dense"
                            label={t('DatasetView.datasetDescription')}
                            fullWidth
                            variant="outlined"
                            value={data.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            sx={{maxWidth: "66.67%", backgroundColor: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                    </Stack>
                    {mode===ViewModes.New && schemas ?
                        <TemplateSelect label={t('DatasetView.selectTemplate')} selectedId={data.schema as string} setSelectedId={(value) => handleChange("schema", value)} entities={schemas}/>
                    : <></>}
                    {mode===ViewModes.New && schemas ?
                        <TemplateSelect label={t('DatasetView.selectTemplate')} selectedId={data.schema as string} setSelectedId={(value) => handleChange("schema", value)} entities={schemas}/>
                    : <></>}
                </ContentHeader>
                <TabContext value={tabContent}>
                    <ContentCard>
                            <TabList onChange={(e, newValue) => {
                                    setTabContent(newValue)
                                    window.history.replaceState(null, "CEITEC Dataset Register", `/collections/${projectId}/datasets/${datasetId}/${newValue}`)
                                }} 
                                    aria-label="lab API tabs example"
                                >
                                <Tab label={t('DatasetView.metadata')} value={"metadata"} />
                                <Tab label={t('DatasetView.files')} value={"files"} />
                                <Tab label={t('DatasetView.settings')} value={"settings"} />
                            </TabList>
                    </ContentCard>
                    <TabPanel value="metadata" sx={{p:0}}>
                        <ContentCard title={t('DatasetView.metadata')} actions={
                            <Button sx={{ml:2}} variant="contained" size="small" onClick={toggleEditor}>
                                {t('DatasetView.switchEditor')}
                            </Button>
                        }>
                            {error ? (
                                <Alert sx={{mb:2}} severity="warning">
                                    {t('DatasetView.metadataProblem')}
                                    <Button sx={{ml:2}} variant="contained" size="small" onClick={toggleEditor}>
                                        {t('DatasetView.switch')}
                                    </Button>
                                </Alert>
                            ) : <></> }
                            {editorMode==='form' ? (
                                schema && schema.uischema ? (
                                    <FormsWrapped readonly={mode===ViewModes.View} schema={schema.schema} uischema={schema.uischema} data={data.metadata} setData={(value) => handleChange("metadata", value)} />
                                ) : <><FormsWrapperSkeleton></FormsWrapperSkeleton></>
                            ) : (
                                <CodeEditor
                                    value={transform}
                                    readOnly={mode===ViewModes.View}
                                    language="js"
                                    placeholder="Please enter JS code."
                                    onChange={(e) => handleChange("metadata", JSON.parse(e.target.value))}
                                    padding={15}
                                    style={{
                                        width: "100%",
                                        fontSize: 14,
                                        backgroundColor: "#FFF",
                                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                    }}
                                />        
                            )}
                        </ContentCard>
                    </TabPanel>
                    <TabPanel value="files" sx={{p:0}}>
                        <ContentCard title={t('DatasetView.filesPreview')} actions={
                            <>
                                <FormGroup>
                                    <FormControlLabel sx={{ width: 135 }} control={<Switch defaultChecked size="small" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />} label={t('DatasetView.autoRefresh')} />
                                </FormGroup>
                                <Button variant="contained" size="small" onClick={() => window.open(`"${config.REACT_APP_BASE_ONEZONE_URL}/i#/onedata/spaces/${projectData?.onedata_space_id}/data`, "_blank")}>
                                    {t('DatasetView.openOnedata')}
                                </Button>
                            </>
                        }>
                            <FilesActiveArea id={datasetId || ""} changeId={() => {}} autoRefresh={autoRefresh} />
                        </ContentCard>
                    </TabPanel>
                    <TabPanel value="settings" sx={{p:0}}>
                        <ContentCard title={t('DatasetView.onedataSettings')}>
                            <>
                                <TextField 
                                    label="Space ID"
                                    value={projectData?.onedata_space_id}
                                    disabled={true}
                                    fullWidth
                                    sx={{mb:2}}/>
                                <TextField 
                                    label="File ID"
                                    value={datasetData?.onedata_file_id}
                                    disabled={true}
                                    fullWidth
                                    sx={{mb:2}}/>
                            </>
                        </ContentCard>
                        {mode!==ViewModes.New && Object.keys(data.shares).length !== 0 ? 
                            <PermissionsTable perms={mode===ViewModes.Edit ? data.perms : "viewer"} currentShares={currentShares} setCurrentShares={setCurrentShares}/>
                        : null }
                    </TabPanel>
                </TabContext>
                <ContentCard paperProps={{variant: "elevation", elevation: 0}} sx={{mb: 2, p: 0}}>
                    <Stack gap={2} direction="row" justifyContent="flex-start">
                        {mode===ViewModes.View ? <></> : (
                            <LoadingButton
                                loading={loadingButtonState}
                                loadingPosition="end"
                                endIcon={<Save />}
                                variant="contained"
                                size="large"
                                onClick={() => saveForm()}
                            >
                                {t('DatasetView.save')}
                            </LoadingButton>
                        )}
                        {tabContent==="0" ? <Button disabled={/*data.metadata==="{}"*/undefined} variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                        {t('DatasetView.downloadMetadata')}
                        </Button> : null} 
                    </Stack>
                </ContentCard>
            </Box>
        )
    } else {
        return (
            <SkeletonView name={"Dataset"} mode={mode}/>
        )
    }
}

export default DatasetView;