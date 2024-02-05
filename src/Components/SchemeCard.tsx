import CardHeader from "./CardHeader"
import FormsWrapped from "./FormsWrapped";
import ListCardBase from "./ListCardBase"

import schema from '../schema.json';
import uischema from '../uischema.json';
import { Button, Dialog, DialogContent, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CloseRounded, DeleteForeverRounded, EditRounded, SaveRounded } from "@mui/icons-material";
import request from "../Utils/Request";
import { useNavigate, useParams } from "react-router-dom";

const SchemeCard = () => {

  const [current, setCurrent] = useState({ id: "", name: "", descr: "", scheme: "", ui_scheme: "" })

  const params = useParams()

  useEffect(() => {
    request("/view_template", {
      id: params.templateId
    }, (response) => {
      setCurrent(response)
    })
  }, [])

  const [templateSettingsOpen, setTemplateSettingsOpen] = useState(false)
  const [data, setData] = useState<any>({});
  
  const navigate = useNavigate()
  
  return (
    <ListCardBase>
      <CardHeader
        openSettings={() => setTemplateSettingsOpen(true)}
        closeSelf={() => navigate("/templates")}
        path={[{ url: "", name: "Šablony" }]}
        current={current.name}
        descr={current.descr}
        settingsButtonText="Nastavení šablony"
      />
      <Paper variant="outlined" sx={{ mt: 3, p: 3, pt: 2 }}>
        <FormsWrapped data={data} setData={setData} schema={current.scheme} uischema={current.ui_scheme} />
      </Paper>
      <Dialog fullWidth open={templateSettingsOpen} onClose={() => setTemplateSettingsOpen(false)}>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 1 }}>Nastavení šablony</Typography>
          <TextField
            margin="dense"
            id="name"
            label="Název"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Popis"
            fullWidth
            variant="outlined"
            multiline
            rows="5"
            sx={{ mb: 2 }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <Button startIcon={<EditRounded/>}>Editovat šablonu</Button>
              <Button color="error" startIcon={<DeleteForeverRounded/>}>Smazat</Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => setTemplateSettingsOpen(false)}>Zrušit</Button>
              <Button startIcon={<SaveRounded/>} variant='contained' onClick={() => setTemplateSettingsOpen(false)}>Uložit</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </ListCardBase>
  )
};

export default SchemeCard;

