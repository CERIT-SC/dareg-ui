import { Box, Button, ButtonGroup, CircularProgress, Dialog, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, styled } from "@mui/material";
import {
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from '../RatingControl';
import ratingControlTester from '../ratingControlTester';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SaveRounded, TextDecreaseRounded, TextIncreaseRounded, UndoRounded, VisibilityRounded } from "@mui/icons-material";
import FormsWrapped, { loadJSON } from "./FormsWrapped";
import { SchemasData } from "../types/global";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { validate } from "@jsonforms/core";
import ContentHeader from "./ContentHeader";
import validateSchema from "../Utils/validateSchema";
import { useTranslation } from "react-i18next";

const FullscreenTextArea = styled("textarea")(({ theme }) => ({
  height: "100%",
  resize: "none",
  flex: "1",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontFamily: "monospace"
}));

export type TemplateEditorState = {
  name: string,
  description: string,
  schema: string,
  uischema: string,
  id?: string
}

type TemplateEditorProps = {
  data: SchemasData,
  setData: Dispatch<SetStateAction<SchemasData>>,
  open: boolean,
  closeSelf: () => void,
  id?: string
}

type EditorMode = "schema" | "ui" | "both"

const TemplateEditor = ({data, setData, open, closeSelf, id}: TemplateEditorProps): JSX.Element => {

  const { t } = useTranslation()

  const renderers = [
    ...materialRenderers,
    //register custom renderers
    { tester: ratingControlTester, renderer: RatingControl },
  ];

  const [schemaTextArea, setSchemeTextArea] = useState<string>(JSON.stringify(data.schema))
  const [uiTextArea, setUiTextArea] = useState<string>(JSON.stringify(data.uischema))

  const [textSize, setTextSize] = useState<number>(14)
  const [editorMode, setEditorMode] = useState<EditorMode>(uiTextArea === "{}" ? "schema" : "both")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setSchemeTextArea(JSON.stringify(data.schema, undefined, 4))
    setUiTextArea(JSON.stringify(data.uischema, undefined, 4))
  }, [data.schema, data.uischema])

  const saveForm = () => {
    setData({
      ...data,
      schema: loadJSON(schemaTextArea),
      uischema: loadJSON(uiTextArea),
    })
    closeSelf()
  }

  const refreshPreview = () => {
    console.log(validateSchema(JSON.parse(schemaTextArea), {}));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

  }

  return (
    <Dialog fullScreen open={open} onClose={closeSelf}>
      <Box display="flex" flexDirection="column" padding={1}>
        <ContentHeader title={`${t("TemplateEditor.editingTemplate")}: ${data.name}`} actions={
          <Stack direction={"row"} gap={1}>
              <Button startIcon={<UndoRounded />} color="error" onClick={closeSelf}>{t("TemplateEditor.discard")}</Button>
              <Button startIcon={<SaveRounded />} variant="contained" onClick={saveForm}>{t("TemplateEditor.save")}</Button>
          </Stack>
        } 
        sx={{
          position: "sticky",
          top: "3px",
          zIndex: 1000,
        }}
        backAction={closeSelf}>
          <Stack direction="row" justifyContent="space-between" mt={2} sx={{background: "#FFF", p:1 }}>
            <Stack direction={"row"} gap={2}>
              <ToggleButtonGroup
                color="primary"
                value={editorMode}
                exclusive
                size="small"
                onChange={(e, value) => {
                  if (value !== null)
                    setEditorMode(value)
                }}
              >
                <ToggleButton value="schema">{t("TemplateEditor.schema")}</ToggleButton>
                <ToggleButton value="ui">{t("TemplateEditor.uiSchema")}</ToggleButton>
                <ToggleButton value="both">{t("TemplateEditor.sideBySide")}</ToggleButton>
              </ToggleButtonGroup>
              <ButtonGroup size="small" variant="outlined">
                <Button onClick={() => setTextSize(textSize - 1)}><TextDecreaseRounded fontSize="small" /></Button>
                <TextField
                  size="small"
                  variant="outlined"
                  sx={{ width: 50 }}
                  value={textSize}
                  onChange={(e) => /^\d+$/.test(e.target.value) && setTextSize(Number(e.target.value))}
                />
                <Button onClick={() => setTextSize(textSize + 1)}><TextIncreaseRounded fontSize="small" /></Button>
              </ButtonGroup>
              <Button
                startIcon={<VisibilityRounded />}
                onClick={() => refreshPreview()}
              >
                {t("TemplateEditor.renderPreview")}
              </Button>
            </Stack>
          </Stack>
        </ContentHeader>
        <Box height="100%" display="flex" gap={2} justifyContent="space-between" >
          <Box height="100%" width="75%" display="flex">
            <Box width="100%" display={editorMode === "ui" ? "none" : "flex"}>
              <CodeEditor
                value={schemaTextArea}
                language="js"
                placeholder="Please enter JS code."
                onChange={(e) => {setSchemeTextArea(e.target.value); refreshPreview()}}
                padding={15}
                style={{
                  width: "100%",
                  fontSize: textSize,
                  backgroundColor: "#FFF",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
              />
              {/* <FullscreenTextArea
                value={schemaTextArea}
                sx={{ fontSize: textSize }}
                spellCheck={false}
                onChange={(e) => {setSchemeTextArea(e.target.value); refreshPreview()}} /> Add tab indent support */}
            </Box>
            <Box width="100%" display={editorMode === "schema" ? "none" : "flex"}>
              <CodeEditor
                value={uiTextArea}
                language="js"
                placeholder="Please enter JS code."
                onChange={(e) => {setUiTextArea(e.target.value); refreshPreview()}}
                padding={15}
                style={{
                  borderLeft: "1px solid #CCC",
                  width: "100%",
                  fontSize: textSize,
                  backgroundColor: "#FFF",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
              />
              {/* <FullscreenTextArea
                value={uiTextArea}
                sx={{ fontSize: textSize }}
                spellCheck={false}
                onChange={(e) => {setUiTextArea(e.target.value); refreshPreview()}} /> */}
            </Box>
          </Box>
          <Box flex="1">
            {loading ? (
              <Box height={"100%"} display="flex" alignItems="center" justifyContent="center">
                <CircularProgress size={80} />
              </Box>
            ) : (
              <FormsWrapped data={{}} setData={() => {}} schema={loadJSON(schemaTextArea)} uischema={loadJSON(uiTextArea)}/>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
};

export default TemplateEditor;