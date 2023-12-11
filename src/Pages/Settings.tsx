import { Box, Button, Card, Divider, Grid, List, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import SettingsMenu from '../Components/SettingsMenu';
import { useTranslation } from 'react-i18next';

const Settings = (props: {selectedTheme: string, setSelectedTheme: (theme: "light"|"dark"|"system") => void}) => {
  const { t, i18n } = useTranslation()
  const langDict:{[key: string]: string} = {
    "en-US": "English",
    "cs-CZ": "čeština",
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" pt={4}>
      <Card sx={{marginTop: 1, padding:"0 16px", width: 300}} variant="outlined">
        <List>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography>{t("Settings.language")}: </Typography>
            <SettingsMenu
              bttnText={langDict[i18n.language]}
              options={langDict}
              onClick={(lang) => i18n.changeLanguage(lang)}
            />
          </Stack>
          <Divider sx={{ mt: 1, mb: 1 }}/>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography>{t("Settings.appearance")}: </Typography>
            <SettingsMenu 
              bttnText={t(`Settings.${props.selectedTheme}`)} 
              options={{system: t("Settings.system"), light: t("Settings.light"), dark: t("Settings.dark")}}
              onClick={(theme: "light"|"dark"|"system") => {props.setSelectedTheme(theme)}}
            />
          </Stack>
        </List>
      </Card>
    </Box>
  );
}

export default Settings;
