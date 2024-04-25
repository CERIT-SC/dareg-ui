import { AccessTime, AccountCircle, Assignment, DataObject, Delete, Edit, GroupAdd, HomeRepairService, Save } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, Dialog, DialogContent, Divider, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Skeleton, Stack, Step, StepContent, StepLabel, Stepper, Tab, TextField, Typography } from "@mui/material";
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
import FilesActiveArea from "./FilesActiveArea";
import TemplateSelect from "../../Components/TemplateSelect";
import PermissionsTable from "../../Components/PermissionsContainer/PermissionsTable";
import SkeletonView from "../../Components/SkeletonView";

type Props = {
    mode: ViewModes
}

const DatasetView = ({mode}: Props) => {

    const navigate = useNavigate();
    const { get, post, patch, loading } = useFetch();

    const { projectId, datasetId } = useParams();
    
    const projectData = useGetProjectQuery(projectId as string).data
    
    const {data: datasetData, isLoading: datasetLoading} = useGetDatasetQuery(datasetId as string, {skip: mode===ViewModes.New})

    const [ tabContent, setTabContent ] = useState<string>("0")
    
    const [ data, setData ] = useState<Dataset>({name: "", description: "", schema: projectData?.default_dataset_schema ? projectData?.default_dataset_schema.id : "", project: {id: "", name: ""}, metadata: {}} as Dataset);

    const {data: schemas, isLoading} = useGetSchemasQuery(1) // TODO: Implement pagination

    const schema = useGetSchemaQuery(data.schema as string).data

    const [ currentShares, setCurrentShares ] = useState<SharesList>(data.shares)
    
    useEffect(() => {
        if ((mode===ViewModes.Edit||mode===ViewModes.View) && datasetData && projectData){
            setData(datasetData)
        }
        else{
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
        switch(mode){
            case ViewModes.Edit:
                updatedDataset = updateDataset({...data, schema: schema?.id, project: typeof data.project == "string" ? data.project : data.project.id, shares: currentShares})
                break;
            case ViewModes.New:
                updatedDataset = addDataset({...data, schema: schema?.id, project: typeof data.project == "string" ? data.project : data.project.id})
                break;
        }
        updatedDataset?.then((response) => {
        setLoadingButtonState(false)
        navigate(`/collections/${projectId}/datasets/${(response as {data: Dataset}).data.id}`)
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

    const repos = [
        "CF repo",
        "CF plants",
        "Test repo"
    ]

    const [ activeStep, setActiveStep ] = useState(0)
    const [ loadingBttn, setLoadingBttn ] = useState(false)
    const [ doiFailed, setDoiFailed ] = useState(false)
    const [ repo, setRepo ] = useState<string[]>([])

    const repoChange = (event: SelectChangeEvent<typeof repos>) => {
        const { target: {value}, } = event
        setRepo(typeof value === 'string' ? value.split(',') : value)
    }

    const requestDoi = () => {
        setLoadingBttn(true);
        setTimeout(() => {
            if (doiFailed) {
                setActiveStep(1)
            }
            else {
                setLoadingBttn(false)
                setDoiFailed(true)
            }
        }, 2000);
    }

    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
          },
        },
      };

    const [newLinkWindow, setNewLinkWindow] = useState(false)
    const [newLinkLabel, setNewLinkLabel] = useState("")
    const [newLinkLevel, setNewLinkLevel] = useState("read")
    const [shares, setShares] = useState<{id: number, level:"read"|"readwrite"|"full", label:string}[]>([])

    const handleNewShare = () => {
        setNewLinkWindow(false)
        setShares([...shares, {id:Math.floor(Math.random() * 1000), level:newLinkLevel as "read"|"readwrite"|"full", label: newLinkLabel}])
        setNewLinkLabel("")
        setNewLinkLevel("read")
    }

    if (!datasetLoading){
        return (
            <Box>
                <ContentHeader<Dataset & Facility> title={`Dataset: ${mode}`} actions={
                            mode===ViewModes.View && data.perms!=="viewer" ? (<Button variant={"contained"} size="medium" endIcon={<Edit />} onClick={() => navigate(`/collections/${projectId}/datasets/${datasetId}/edit`)}>
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
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            sx={{maxWidth: "33.33%", background: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                        <TextField
                            margin="dense"
                            label="Dataset description"
                            fullWidth
                            variant="outlined"
                            value={data.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            sx={{maxWidth: "66.67%", backgroundColor: "#FFF"}}
                            disabled={mode===ViewModes.View}
                            />
                    </Stack>
                    {mode===ViewModes.New && schemas ?
                        <TemplateSelect label="Select template" selectedId={data.schema as string} setSelectedId={(value) => handleChange("schema", value)} entities={schemas}/>
                    : <></>}
                </ContentHeader>
                <TabContext value={tabContent}>
                    <ContentCard>
                            <TabList onChange={(e, newValue) => setTabContent(newValue)} aria-label="lab API tabs example">
                                <Tab label="Metadata" value={"0"} />
                                <Tab label="Files" value={"1"} />
                                <Tab label="Pre-share" value={"2"} />
                                <Tab label="Settings" value={"3"} />
                                <Tab label="Publish" value={"4"} />
                            </TabList>
                    </ContentCard>
                    <TabPanel value="0" sx={{p:0}}>
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
                    </TabPanel>
                    <TabPanel value="1" sx={{p:0}}>
                        <ContentCard title={"Files"}>
                            {true ? <Typography variant="subtitle1">No files available</Typography> :
                                <FilesActiveArea id="sss" changeId={() => {}} />
                            }
                        </ContentCard>
                    </TabPanel>
                    <TabPanel value="2" sx={{p:0}}>
                        <ContentCard title={"Pre-share"} actions={
                            <Button size="small" variant="contained" onClick={() => setNewLinkWindow(true)}>Add new</Button>
                        }>
                            <>
                                {shares.length > 0 ? shares.map((share) => (
                                <>
                                    <Divider/>
                                    <Stack direction="row" alignItems={"center"} spacing={2} py={1} justifyContent={"space-between"}>
                                        <IconButton size="small" onClick={() => setShares(shares.filter((item) => item.id != share.id))}>
                                            <Delete/>
                                        </IconButton>
                                        <Box flex={2} overflow="auto">
                                            <Typography noWrap >https://devel.dareg.biodata.ceitec.cz/api/v1/share/fj2h2eo20wiojerigjeirg</Typography>
                                        </Box>
                                        <Box flex={1}>
                                            <TextField label="Label" fullWidth size="small" value={share.label} onChange={(e) => setShares(shares.map((item) => item.id === share.id ? {...item, label: e.target.value} : item))}></TextField>
                                        </Box>
                                        <FormControl sx={{width: 200}}>
                                            <InputLabel id={`${share.id}-label`}>Permissions</InputLabel>
                                            <Select
                                                labelId={`${share.id}-label`}
                                                value={share.level}
                                                label="Permissions"
                                                size="small"
                                                onChange={(e) => setShares(shares.map((item) => item.id === share.id ? {...item, level: e.target.value as "read"|"readwrite"|"full"} : item))}
                                            >
                                                <MenuItem value={"read"}>Read-only</MenuItem>
                                                <MenuItem value={"readwrite"}>Read-write</MenuItem>
                                                <MenuItem value={"full"}>Full access</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </>
                                )) : <Typography>No active shares links</Typography>}
                                <Dialog open={newLinkWindow} onClose={() => setNewLinkWindow(false)}>
                                <DialogContent sx={{ width: 400 }}>
                                        <Stack>
                                                <Box>
                                                    <Typography variant="h6">
                                                        Add a new link share
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        You can add a label for later identification
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    name="name"
                                                    label="Label"
                                                    type="text"
                                                    fullWidth
                                                    variant="filled"
                                                    size="small"
                                                    sx={{mt:1}}
                                                    value={newLinkLabel}
                                                    onChange={(e) => setNewLinkLabel(e.target.value)}
                                                />
                                                <FormControl sx={{mt:2}}>
                                                <InputLabel id={"newshare-label"}>Permissions</InputLabel>
                                                <Select
                                                    labelId={"newshare-label"}
                                                    value={newLinkLevel}
                                                    label="Permissions"
                                                    size="small"
                                                    onChange={(e) => setNewLinkLevel(e.target.value)}
                                                >
                                                    <MenuItem value={"read"}>Read-only</MenuItem>
                                                    <MenuItem value={"readwrite"}>Read-write</MenuItem>
                                                    <MenuItem value={"full"}>Full access</MenuItem>
                                                </Select>
                                                </FormControl>

                                            <Stack direction="row-reverse" spacing={2} sx={{mt:2}}>
                                                <Button type="submit" onClick={handleNewShare} variant="contained">Submit</Button>
                                            </Stack>
                                        </Stack>
                                </DialogContent>
                                </Dialog>
                            </>
                        </ContentCard>
                    </TabPanel>
                    <TabPanel value="3" sx={{p:0}}>
                        <ContentCard title={"Dataset lifecycle settings"}>
                            <>
                                    <TextField 
                                        label="Dataset ID"
                                        value={data.id}
                                        disabled={true}
                                        fullWidth
                                        sx={{mb:2}}/>
                                    <TextField 
                                        label="Dataset Retention"
                                        value={"3m"}
                                        helperText="How long should the dataset be kept on hot storage?"
                                        disabled={true}
                                        fullWidth
                                        sx={{mb:2}}/>
                            </>
                        </ContentCard>
                        <ContentCard title={"Onedata settings"}>
                            <>
                                    <TextField 
                                        label="Space ID"
                                        value={data.id}
                                        disabled={true}
                                        fullWidth
                                        sx={{mb:2}}/>
                            </>
                        </ContentCard>
                        {mode!==ViewModes.New ? 
                            <PermissionsTable perms={mode===ViewModes.Edit ? data.perms : "viewer"} currentShares={currentShares} setCurrentShares={setCurrentShares}/>
                        : null }
                    </TabPanel>
                    <TabPanel value="4" sx={{p:0}}>
                        <Grid container spacing={2}>
                            <Grid item flex={1}>
                                <ContentCard title={"Request DOI"}>
                                    <Stepper activeStep={activeStep} orientation="vertical" sx={{pb: 1}}>
                                        <Step key={"Request DOI"}>
                                            <StepLabel>Request DOI</StepLabel>
                                            <StepContent>
                                                <Typography sx={{mt:1}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum minus esse enim corrupti! Eius nam sint corrupti laborum fuga esse repellat! Sed totam saepe, nam mollitia fugiat commodi voluptates assumenda!</Typography>
                                                <Stack direction="row" alignItems="baseline">
                                                    <LoadingButton sx={{mt:1.5, mr: 2}} loading={loadingBttn} onClick={requestDoi} variant="contained">Request DOI</LoadingButton>
                                                    {doiFailed ? 
                                                        <Typography variant="overline" color="error" fontWeight={600} fontSize={13}>Request failed</Typography>
                                                    : null}
                                                </Stack>
                                            </StepContent>
                                        </Step>
                                        <Step key={"Lock"}>
                                            <StepLabel>DOI registered</StepLabel>
                                            <StepContent>
                                                <TextField label={"DOI"} sx={{mt:1}} onFocus={(e) => e.target.select()} fullWidth size="small" variant="outlined" value="https://doi.org/10.3352/jeehp.2013.10.3"></TextField>
                                                <Typography sx={{mt:1.5}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum minus esse enim corrupti! Eius nam sint corrupti laborum fuga esse repellat! Sed totam saepe, nam mollitia fugiat commodi voluptates assumenda!</Typography>
                                                <Button onClick={() => setActiveStep(2)} sx={{mt:1.5}} variant="contained">Finalize</Button>
                                            </StepContent>
                                        </Step>
                                        <Step key={"Finalized"} completed={activeStep===2}>
                                            <StepLabel>Finalized</StepLabel>
                                            <StepContent>
                                                <TextField label={"DOI"} sx={{mt:1}} onFocus={(e) => e.target.select()} fullWidth size="small" variant="outlined" value="https://doi.org/10.3352/jeehp.2013.10.3"></TextField>
                                                <Typography sx={{mt:1.5}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum minus esse enim corrupti! Eius nam sint corrupti laborum fuga esse repellat! Sed totam saepe, nam mollitia fugiat commodi voluptates assumenda!</Typography>
                                            </StepContent>
                                        </Step>
                                    </Stepper>
                                </ContentCard>
                            </Grid>
                            <Grid item flex={1}>
                                <ContentCard title={"Publication"}>
                                    <>
                                        <Typography sx={{mt:1.5}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum minus esse enim corrupti! Eius nam sint corrupti laborum fuga esse repellat! Sed totam saepe, nam mollitia fugiat commodi voluptates assumenda!</Typography>
                                        <FormControl fullWidth sx={{mt: 2.5}}>
                                            <InputLabel id="repo-select">Select repositories</InputLabel>
                                            <Select input={<OutlinedInput label="Select repositories" />} labelId="repo-select" fullWidth multiple value={repo} onChange={repoChange} renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps}>
                                                {repos.map((name) => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox checked={repo.indexOf(name) > -1}/>
                                                        <ListItemText primary={name}/>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box sx={{display: "flex", flexDirection:"row-reverse"}}>
                                            <Button fullWidth sx={{mt:2.5}} variant="contained">Publish</Button>
                                        </Box>
                                    </>
                                </ContentCard>
                            </Grid>
                        </Grid>

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
                                Save
                            </LoadingButton>
                        )}
                        {tabContent==="0" ? <Button disabled={/*data.metadata==="{}"*/undefined} variant="contained" size="large" endIcon={<DataObject />} onClick={() => downloadMetadata()}>
                            Download metadata
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