import { Avatar, Box, CardMedia, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { BackupTableRounded, ExitToAppRounded, FolderCopyRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import ceitec_logo from '../ceitec_logo.png'
import { useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const LeftBar = (props: {setSection: (value: string) => void}) => {
  const LeftButton = styled(ListItemButton)(({}) => ({
    "&:hover": {
      fontWeight: 400,
    }
  }))

  const auth = useAuth();
  const { t } = useTranslation()
  const location = useLocation();

  return (
    <Stack direction="row" height="100vh">
      <Box padding={4} pt={2} height="100vh" justifyContent="space-between" display="flex" flexDirection="column">
        <List disablePadding>
          <Box sx={{ width: 250, ml: -1, mr: -1, mb: 2}}>
            <CardMedia
              component="img"
              image={ceitec_logo}
              width={300}
            />
          </Box>
          <ListItem disablePadding>
            <ListItemButton selected={location.pathname.startsWith('/projects') || location.pathname==="/"} onClick={() => props.setSection("projects")}>
              <ListItemIcon>
                <FolderCopyRounded />
              </ListItemIcon>
              <ListItemText primary={t('LeftBar.projects')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
          <ListItemButton selected={location.pathname.startsWith('/templates')} onClick={() => props.setSection("templates")}>
              <ListItemIcon>
                <BackupTableRounded />
              </ListItemIcon>
              <ListItemText primary={t('LeftBar.templates')} />
            </ListItemButton>
          </ListItem>
        </List>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={() => props.setSection("projects")}>
              <ListItemIcon>
                <ExitToAppRounded />
              </ListItemIcon>
              <ListItemText primary={t('LeftBar.logout')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
          <ListItemButton onClick={() => props.setSection("account")}>
              <ListItemIcon>
                <Avatar sx={{width: "24px", height: "24px"}} />
              </ListItemIcon>
              <ListItemText primary={auth.user?.profile.name || t('LeftBar.account')} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider orientation="vertical"/>
    </Stack>
  );
}

export default LeftBar;
