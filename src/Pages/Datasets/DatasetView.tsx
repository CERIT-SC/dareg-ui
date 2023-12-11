import { AccessTime, AccountCircle, Assignment, DataObject, Edit, HomeRepairService, Save } from "@mui/icons-material";
import { Alert, Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import ContentHeader from "../../Components/ContentHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContentCard from "../../Components/ContentCard";
import FormsWrapped, { FormsWrapperSkeleton } from "../../Components/FormsWrapped";
import useFetch from "use-http";
import { ProjectDataStateKeys } from "../Projects/ProjectEdit";
import { stringify } from 'yaml'
import { DaregAPIMinimalNestedObject, FormData } from "../../types/global";
import { ViewModes } from "../../types/enums";
import { Dataset, DatasetRequest, useAddDatasetMutation, useGetDatasetQuery, useUpdateDatasetMutation } from "../../Services/datasets";
import { useGetSchemaQuery } from "../../Services/schemas";
import { Project, useGetProjectQuery } from "../../Services/projects";
import { LoadingButton } from "@mui/lab";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Facility } from "../../Services/facilities";

type Props = {
    mode: ViewModes
}

const DatasetView = ({mode}: Props) => {

    const navigate = useNavigate();
    const { get, post, patch, loading } = useFetch();

    const { projectId, datasetId } = useParams();
    
    const projectData = useGetProjectQuery(projectId as string).data
    
    const datasetData = useGetDatasetQuery(datasetId as string).data
    
    const [ data, setData ] = useState<Dataset>({name: "", description: "", schema: {id: "", name: ""}, project: {id: "", name: ""}, metadata: {}} as Dataset);

    const schema = useGetSchemaQuery(projectData?.default_dataset_schema.id ?? "").data
    
    useEffect(() => {
        if ((mode===ViewModes.Edit||mode===ViewModes.View) && datasetData && projectData){
            setData(datasetData)
        }
        else{
            const dataset_schema = projectData?.default_dataset_schema.id
            setData({...data, project: projectData as Project, schema: dataset_schema || ""})
        }
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
        switch(mode){
            case ViewModes.Edit:
                updatedDataset = updateDataset({...data, schema: schema?.id, project: typeof data.project == "string" ? data.project : data.project.id})
                break;
            case ViewModes.New:
                updatedDataset = addDataset({...data, schema: schema?.id, project: typeof data.project == "string" ? data.project : data.project.id})
                break;
        }
        updatedDataset?.then((response) => {
        setLoadingButtonState(false)
        navigate(`/projects/${projectId}/datasets/${(response as {data: Dataset}).data.id}`)
        })
    }

    const handleChange = (inputId: ProjectDataStateKeys | keyof FormData, e: any): void => {
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

    if (!loading){
        return (
            <Box>
                <ContentHeader<Dataset & Facility> title={`Dataset: ${mode}`} actions={
                            mode===ViewModes.View ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/edit`)}>
                                Edit
                            </Button>) : <></>
                        }
                        metadata={
                            mode === ViewModes.View ? [
                                { id: "name", value: projectData?.name ?? "", label: "Project Name", icon: <Assignment /> },
                                { id: "abbreviation", value: projectData?.facility.abbreviation ?? "", label: "Facility abbreviation", icon: <HomeRepairService /> },
                                { id: "created", value: data.created || "", label: "Created At", icon: <AccessTime />, renderCell: (value) => (new Date(value).toLocaleString()) },
                                { id: "created_by", value: data.created_by?.full_name || "", label: "Author", icon: <AccountCircle /> },
                            ] :
                            []
                        }>
                    <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Dataset name"
                            fullWidth
                            required
                            variant="filled"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                        <TextField
                            margin="dense"
                            label="Dataset description"
                            fullWidth
                            variant="filled"
                            value={data.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                    </Stack>
                </ContentHeader>
                <ContentCard title={"Metadata"} actions={
                    <Button sx={{ml:2}} variant="contained" size="small" onClick={toggleEditor}>
                        Switch Editor
                    </Button>
                }>
                    {error ? (
                        <Alert sx={{mb:2}} severity="warning">
                            There might be a problem with metadata! Switch to the text editor instead?
                            <Button sx={{ml:2}} variant="contained" size="small" onClick={toggleEditor}>
                                Switch
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
                <ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
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
                                Save
                            </LoadingButton>
                        )}
                        <Button disabled={/*data.metadata==="{}"*/undefined} variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                            Download metadata
                        </Button>
                    </Stack>
                </ContentCard>
            </Box>
        )
    } else {
        return (
            <Box>
                <ContentHeader title={`Dataset: ${mode}`} actions={
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
                            variant="filled"
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
                            variant="filled"
                            value={""}
                            disabled={true}
                            sx={{maxWidth: "66.67%", background: "#FFF"}}
                            />
                        </Skeleton>
                    </Stack>
                </ContentHeader>
                <ContentCard title={"Metadata"}>
                    <Skeleton width={"100%"} height={"4em"}/>
                    <Skeleton width={"100%"} height={"3em"}/>
                    <Skeleton width={"100%"} height={"3em"}/>
                    <Skeleton width={"75%"} height={"2em"}/>
                    <Skeleton width={"50%"} height={"2em"}/>
                    <Skeleton width={"25%"} height={"2em"}/>
                </ContentCard>
                <ContentCard paperProps={{elevation: 0}} sx={{mb: 2, p: 0}}>
                    <Stack gap={2} direction="row" justifyContent="flex-start">
                        <Skeleton width={"5%"} height={"4em"}>
                        {mode===ViewModes.View ? <></> : (
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
                        )}
                        </Skeleton>
                        <Skeleton>
                            <Button variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                                Download metadata
                            </Button>
                        </Skeleton>
                    </Stack>
                </ContentCard>
            </Box>
        )
    }
}

export default DatasetView;