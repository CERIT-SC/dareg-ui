import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { DesignServices, Save } from "@mui/icons-material";
import TemplateEditor from "../../Components/TemplateEditor";
import { useEffect, useState } from "react";
import FormsWrapped from "../../Components/FormsWrapped";
import ContentCard from "../../Components/ContentCard";
import ContentHeader from "../../Components/ContentHeader";
import { useFetch } from "use-http";
import { SchemasData } from "../../types/global";
import { ViewModes } from "../../types/enums";
import { useAddSchemaMutation, useGetSchemaQuery, useUpdateSchemaMutation } from "../../Services/schemas";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";


type TemplateEditorStateKeys = keyof SchemasData | 'full-editor';

type Props = {
    mode: ViewModes
}

const TemplatesNew = ({mode}: Props) => {
    const { t } = useTranslation()

    const navigate = useNavigate();
    const { templateId } = useParams();
    
    const [templateEditorState, setTemplateEditorState] = useState<boolean>(false)

    const [ loadingButtonState, setLoadingButtonState ] = useState<boolean>(false)
    
    const schemaData = useGetSchemaQuery(templateId as string, {skip: mode===ViewModes.New}).data
    const [data, setData] = useState<SchemasData>({id: "", created: "", name: "", description: "", uischema: {}, schema: {}})
    
    useEffect(() => {
        if (mode===ViewModes.Edit && schemaData)
            setData(schemaData as SchemasData)
    }, [schemaData])
    

    const openEditor = (type: TemplateEditorStateKeys): void => {
        switch(type){
            case "uischema":
                break;
            case "schema":
                break;
            case "full-editor":
                setTemplateEditorState(true)
                break;
            default:
                break;
        }
    }

    const handleChange = (inputId: TemplateEditorStateKeys, e: any): void => {
        console.log(e)
        setData({
            ...data,
            [inputId]: e.target.value
        })
    }

    const closeEditor = ():void => {
        setTemplateEditorState(false);
    }

    const [ addSchema ] = useAddSchemaMutation()
    const [ updateSchema ] = useUpdateSchemaMutation()
    
    const saveForm = (): void => {
        let updatedSchema;
        setLoadingButtonState(true)
        switch(mode){
            case ViewModes.Edit:
                updatedSchema = updateSchema({id: data.id, name:data.name, description:data.description, schema:data.schema, uischema:data.uischema})
                break;
            case ViewModes.New:
                updatedSchema =  addSchema(data)
                break; 
            }
        updatedSchema?.then((response) => {
            navigate(`/templates/${(response as {data: {id: string}}).data.id}`)
            setLoadingButtonState(false)
        })
    }

    return (
      <Box>
        <ContentHeader title={`${t('TemplatesEdit.template')}: ${t('mode.'+mode)}`}>
            <Stack direction="row" justifyContent="center" alignItems="baseline" gap={2}>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('TemplatesEdit.templateName')}
                    fullWidth
                    variant="outlined"
                    value={data.name}
                    onChange={(e) => handleChange("name", e)}
                    sx={{maxWidth: "33.33%", background: (theme) => theme.palette.background.paper}}
                    />
                <TextField
                    margin="dense"
                    label={t('TemplatesEdit.templateDescription')}
                    fullWidth
                    variant="outlined"
                    value={data.description}
                    onChange={(e) => handleChange("description", e)}
                    sx={{maxWidth: "66.67%", background: (theme) => theme.palette.background.paper}}
                    />
            </Stack>
        </ContentHeader>
        <ContentCard title={t('TemplatesEdit.editTemplates')}>
            <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={3}>
                {/* <Button onClick={() => openEditor("data-schema")}>
                    <Paper sx={{p:5}}>
                        <Schema fontSize="large"></Schema>
                        <Typography sx={{fontWeight: "bold"}} variant="body1">JSON Schema</Typography>
                    </Paper>
                </Button>
                <Button onClick={() => openEditor("ui-schema")}>
                    <Paper sx={{p:5}}>
                        <ArtTrack fontSize="large" />
                        <Typography sx={{fontWeight: "bold"}} variant="body1">UI JSON Schema</Typography>
                    </Paper>
                </Button> */}
                <Button onClick={() => openEditor("full-editor")}>
                    <Paper sx={{p:5}}>
                        <DesignServices fontSize="large" />
                        <Typography sx={{fontWeight: "bold"}} variant="body1">{t('TemplatesEdit.templatesEditor')}</Typography>
                    </Paper>
                </Button>
            </Stack>
            <TemplateEditor data={data} setData={setData} open={templateEditorState} closeSelf={closeEditor} />
        </ContentCard>

        <ContentCard title={t('TemplatesEdit.preview')}>
            {(data.schema || data.uischema) ? 
            <FormsWrapped schema={data.schema} uischema={data.uischema} data={{}} setData={() => {}} />
            : <>{t('TemplatesEdit.noSchema')}</>}
        </ContentCard>

        {/* <ContentCard title={"Permissions"} actions={
            <Button variant="outlined" startIcon={<GroupAdd />}>
                    Add user/group
                </Button>
            }>
        <PermissionsTable />
        </ContentCard> */}
        <ContentCard paperProps={{variant: "elevation", elevation: 0}} sx={{mb: 2, p: 0}}>
            <LoadingButton
                loading={loadingButtonState}
                loadingPosition="end"
                endIcon={<Save />}
                variant="contained"
                size="large"
                onClick={() => saveForm()}
            >
                {t('TemplatesEdit.save')}
            </LoadingButton>
        </ContentCard>
        {/*error ? <Typography variant="subtitle1">{error.message || ""}</Typography> : <p></p>*/}
      </Box>
    )
}

export default TemplatesNew