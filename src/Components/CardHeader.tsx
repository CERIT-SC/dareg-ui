import { ArrowBackRounded, Close, ContentCopyRounded, DeleteForeverRounded, EditRounded, NavigateNextRounded, SaveRounded, SettingsRounded, UndoRounded, WarningRounded } from "@mui/icons-material";
import { Autocomplete, Box, Breadcrumbs, Button, Chip, IconButton, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import bull from "./Bull";
import CardButton from "./CardButton";
import { useTranslation } from "react-i18next";
import MyBreadcrumbs from "./MyBreadcrumbs";

const defaultProps = {
  disableDuplicate: false
}

const CardHeader = (props: {
    closeSelf: () => void,
    openSettings: () => void,
    disableDuplicate: boolean,
    path: { url: string, name: string }[],
    current: string,
    descr: string,
    settingsButtonText: string
  }) => {
  
  const [editingHeader, setEditingHeader] = useState(false)
  const { t } = useTranslation()
  
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Stack direction="row" alignItems="center">
          <IconButton sx={{ mr: 1 }} edge="start" onClick={() => {props.closeSelf(); setEditingHeader(false)}}><ArrowBackRounded/></IconButton>
          <Typography variant="h5" color="text.primary">{props.current}</Typography>
        </Stack>
        <Button onClick={props.openSettings} startIcon={<SettingsRounded/>}>{props.settingsButtonText}</Button>
      </Stack>
      <Typography variant="body2" sx={{ mb: 1 }} >
        user123 {bull} 2 months ago
      </Typography>
      
      <Stack display="none" direction="row" mb={1} alignItems="center">
        <MyBreadcrumbs path={props.path} current={props.current} />
        <WarningRounded sx={{ mr: 1, mb: 0.25 }} color="error"/>
        <Typography sx={{ mr: 1 }} variant="overline" fontSize="14px" color="error">Stará verze šablony</Typography>
        <Button size="small">Upgradovat</Button>
      </Stack>
      
      {editingHeader
        ?
        <TextField sx={{ mt: 1, mb: 1}} label="Description" variant="outlined" multiline rows={6} fullWidth defaultValue="Project description lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Vivamus ac leo pretium faucibus. Cras pede libero, dapibus nec, pretium sit amet."/>
        :
        <Typography variant="body2" textAlign="justify">
          {props.descr}
        </Typography>
      }
    </Box>
  )
};

CardHeader.defaultProps = defaultProps;

export default CardHeader;
