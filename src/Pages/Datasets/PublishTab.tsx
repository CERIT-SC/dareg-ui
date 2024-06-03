import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Link, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Skeleton, Stack, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material"
import { Doi, useFinalizeDoiMutation, useNewDoiMutation } from "../../Services/dois"
import ContentCard from "../../Components/ContentCard"
import { LoadingButton } from "@mui/lab"
import { Cancel, CheckCircle, Close, ContentPaste } from "@mui/icons-material"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Files } from "../../Services/files"
import { JsonForms } from "@jsonforms/react"
import { materialCells, materialRenderers } from "@jsonforms/material-renderers"
import ratingControlTester from "../../ratingControlTester"
import RatingControl from "../../RatingControl"
import CodeEditor from '@uiw/react-textarea-code-editor';

type Props = {
    doi: Doi,
    filesData: Files | undefined,
    formCorrect: boolean
}

const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: ratingControlTester, renderer: RatingControl },
];

const PublishTab = ({doi, filesData, formCorrect}: Props) => {

    const transform = useMemo(() => JSON.stringify(doi, undefined, 4), [doi])

    const { projectId, datasetId } = useParams();

    const repos = [
        "CF repo",
        "CF plants",
        "Test repo"
    ]

    const [ doiWindowOpen, setDoiWindowOpen ] = useState(false)
    const [ loadingBttn, setLoadingBttn ] = useState(false)
    const [ loadingBttnFinal, setLoadingBttnFinal ] = useState(false)
    const [ doiFailed, setDoiFailed ] = useState(false)
    const [ doiFinalFailed, setDoiFinalFailed ] = useState(false)
    const [ repo, setRepo ] = useState<string[]>([])

    const repoChange = (event: SelectChangeEvent<typeof repos>) => {
        const { target: {value}, } = event
        setRepo(typeof value === 'string' ? value.split(',') : value)
    }

    const [ newDoi ] = useNewDoiMutation()

    const requestDoi = () => {
        setLoadingBttn(true)
        setDoiFailed(false)
        newDoi({dataset_id: datasetId as string}).then((response) => {
            setTimeout(() => {
                setLoadingBttn(false)
            }, 1000);
            try {
                if (!(response as {data: {success: boolean}}).data.success) {
                    setDoiFailed(true)
                }
            } catch (error) {
                setDoiFailed(true)
            }
        })
    }

    const [ finalDoi ] = useFinalizeDoiMutation()

    const finalizeDoi = () => {
        setLoadingBttnFinal(true)
        setDoiFinalFailed(false)
        finalDoi({dataset_id: datasetId as string}).then((response) => {
            setTimeout(() => {
                setLoadingBttnFinal(false)
            }, 1000);
            try {
                if (!(response as {data: {success: boolean}}).data.success) {
                    setDoiFinalFailed(true)
                }
            } catch (error) {
                setDoiFinalFailed(true)
            }
        })
        
    }

    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
          },
        },
    };

    if (doi) {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item flex={1}>
                        <ContentCard title={"Request DOI"}>
                            <Stepper activeStep={doi.attributes.state === "none" ? 0 : doi.attributes.state === "draft" ? 1 : 2} orientation="vertical" sx={{pb: 1}}>
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
                                    <StepLabel>DOI registered{doi.attributes.state === "draft" ? <Link onClick={() => setDoiWindowOpen(true)} href="#" sx={{ml: 2}} color={"secondary"}>View DOI</Link> : null}</StepLabel>
                                    <StepContent>
                                        <FormControl fullWidth>
                                            <Input endAdornment={<InputAdornment position="end"><IconButton onClick={() => {navigator.clipboard.writeText(doi.id)}}><ContentPaste/></IconButton></InputAdornment>} disabled id="doiReg" sx={{mt:1}} fullWidth value={doi.id}></Input>
                                        </FormControl>
                                        <Typography sx={{mt:1.5}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum minus esse enim corrupti! Eius nam sint corrupti laborum fuga esse repellat! Sed totam saepe, nam mollitia fugiat commodi voluptates assumenda!</Typography>
                                        <Stack direction="row" alignItems="baseline">
                                            <LoadingButton color="error" sx={{mt:1.5, mr: 2}} loading={loadingBttnFinal} onClick={finalizeDoi} variant="contained">Finalize</LoadingButton>
                                            {doiFinalFailed ? 
                                                <Typography variant="overline" color="error" fontWeight={600} fontSize={13}>Request failed</Typography>
                                            :
                                                <Typography variant="overline" color="error" fontWeight={600} fontSize={13}>This action is irreversible</Typography>
                                            }
                                        </Stack>
                                    </StepContent>
                                </Step>
                                <Step key={"Finalized"} completed={doi.attributes.state === "findable"}>
                                    <StepLabel>Finalized{doi.attributes.state === "findable" ? <Link onClick={() => setDoiWindowOpen(true)} href="#" sx={{ml: 2}} color={"secondary"}>View DOI</Link> : null}</StepLabel>
                                    <StepContent>
                                    <FormControl fullWidth>
                                        <Input endAdornment={<InputAdornment position="end"><IconButton onClick={() => {navigator.clipboard.writeText(doi.id)}}><ContentPaste/></IconButton></InputAdornment>} disabled id="doiReg" sx={{mt:1}} fullWidth value={doi.id}></Input>
                                    </FormControl>
                                    <Typography sx={{mt:1.5}}>DOI is now findable. You cannot make any changes. </Typography>
                                    </StepContent>
                                </Step>
                            </Stepper>
                        </ContentCard>
                    </Grid>
                    <Grid item flex={1}>
                        <ContentCard title={"Publication"}>
                            <>
                                <Typography sx={{mt:1.5}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum minus esse enim corrupti! Eius nam sint corrupti laborum fuga esse repellat! Sed totam saepe, nam mollitia fugiat commodi voluptates assumenda!</Typography>
                                {formCorrect ? 
                                    <Stack direction="row" alignItems="center" mb={-1}>
                                        <CheckCircle color="success" fontSize="small"></CheckCircle>
                                        <Typography sx={{ml:1, mt: 0.25}} color="success" variant="overline">Metadata</Typography>
                                    </Stack>
                                :
                                    <Stack direction="row" alignItems="center" mb={-1}>
                                        <Cancel color="error" fontSize="small"></Cancel>
                                        <Typography sx={{ml:1, mt: 0.25}} color="error" variant="overline">Metadata incorrect</Typography>
                                    </Stack>
                                }
                                {filesData && filesData.files && filesData.files[16] && (filesData.files[16][1] as any).length > 0 ?
                                    <Stack direction="row" alignItems="center" mb={-1}>
                                        <CheckCircle color="success" fontSize="small"></CheckCircle>
                                        <Typography sx={{ml:1, mt: 0.25}} color="success" variant="overline">Files</Typography>
                                    </Stack>
                                :
                                    <Stack direction="row" alignItems="center" mb={-1}>
                                        <Cancel color="error" fontSize="small"></Cancel>
                                        <Typography sx={{ml:1, mt: 0.25}} color="error" variant="overline">Files missing</Typography>
                                    </Stack>
                                }
                                {doi && doi.attributes.state === "findable" ?
                                    <Stack direction="row" alignItems="center" mb={-1}>
                                        <CheckCircle color="success" fontSize="small"></CheckCircle>
                                        <Typography sx={{ml:1, mt: 0.25}} color="success" variant="overline">DOI</Typography>
                                    </Stack>
                                :
                                    <Stack direction="row" alignItems="center" mb={-1}>
                                        <Cancel color="error" fontSize="small"></Cancel>
                                        <Typography sx={{ml:1, mt: 0.25}} color="error" variant="overline">DOI missing</Typography>
                                    </Stack>
                                }

                                <FormControl fullWidth sx={{mt: 2.5}}>
                                    <InputLabel id="repo-select">Select repositories</InputLabel>
                                    <Select
                                        disabled={!(formCorrect && filesData && filesData.files && filesData.files[16] && (filesData.files[16][1] as any).length > 0 && doi && doi.attributes.state === "findable")}
                                        input={<OutlinedInput label="Select repositories" />}
                                        labelId="repo-select"
                                        fullWidth
                                        multiple
                                        value={repo}
                                        onChange={repoChange}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {repos.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={repo.indexOf(name) > -1}/>
                                                <ListItemText primary={name}/>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Box sx={{display: "flex", flexDirection:"row-reverse"}}>
                                    <Button
                                        disabled={!(formCorrect && filesData && filesData.files && filesData.files[16] && (filesData.files[16][1] as any).length > 0 && doi && doi.attributes.state === "findable")}
                                        fullWidth
                                        sx={{mt:2.5}}
                                        variant="contained"
                                    >
                                        Publish
                                    </Button>
                                </Box>
                            </>
                        </ContentCard>
                    </Grid>
                </Grid>
                <Dialog
                    open={doiWindowOpen}
                    PaperProps={{ sx: { maxWidth: "unset" } }}
                    onClose={() => setDoiWindowOpen(false)}
                >
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        DOI<IconButton onClick={() => setDoiWindowOpen(false)}><Close/></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <CodeEditor
                            value={transform}
                            readOnly
                            placeholder="Please enter JS code."
                            padding={15}
                            data-color-mode="light"
                            style={{
                                width: "100%",
                                fontSize: 14,
                                backgroundColor: "#FFF",
                                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            }}
                        />        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDoiWindowOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </>
            
    )} else { return (
        <>
            <Skeleton width={1000} height={50}/>
            <Skeleton width={1400} height={50}/>
            <Skeleton width={900} height={50}/>
        </>
    )}
}

export default PublishTab;