import { Avatar, Box, CardMedia, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { BackupTableRounded, ExitToAppRounded, FolderCopyRounded, LibraryBooksRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import ceitec_logo from '../ceitec_logo.png'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useGetProfileQuery } from '../Services/profile';
import { useEffect, useMemo } from 'react';
import config from '../Config';
import useAvatar from '../Utils/useAvatar';

const LeftBar = (props: {setSection: (value: string) => void}) => {
  const LeftButton = styled(ListItemButton)(({}) => ({
    "&:hover": {
      fontWeight: 400,
    }
  }))

  const auth = useAuth();
  const { t } = useTranslation()
  const location = useLocation();
  const profile = useGetProfileQuery(1)

  const {avatarUrl, avatarComponent} = useAvatar({size: 48});

  useEffect(() => {
    if (profile.isSuccess) {
      if (!(profile.data?.results[0].any_facilities || profile.data?.results[0].any_projects)) { // no projects and no facilities
        if (!profile.data?.results[0].any_datasets) { // no datasets
          props.setSection("templates")
        }
        else {
          props.setSection("datasets")
        }
      }
    }
  }, [profile.isSuccess])


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
          {profile.data?.results[0].any_facilities || profile.data?.results[0].any_projects ?
            <ListItem disablePadding>
              <ListItemButton selected={location.pathname.startsWith('/collections') || location.pathname==="/"} onClick={() => props.setSection("collections")}>
                <ListItemIcon>
                  <FolderCopyRounded />
                </ListItemIcon>
                <ListItemText primary={t('LeftBar.projects')} />
              </ListItemButton>
            </ListItem>
          : null}
          {profile.data?.results[0].any_datasets ?
            <ListItem disablePadding>
              <ListItemButton selected={location.pathname.startsWith('/datasets')} onClick={() => props.setSection("datasets")}>
                <ListItemIcon>
                  <LibraryBooksRounded />
                </ListItemIcon>
                <ListItemText primary={t('LeftBar.datasets')} />
              </ListItemButton>
            </ListItem>
          : null}
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
            <ListItemButton onClick={() => auth.signoutRedirect()}>
              <ListItemIcon>
                <ExitToAppRounded />
              </ListItemIcon>
              <ListItemText primary={t('LeftBar.logout')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{border: "1px", borderStyle: "solid", borderRadius: "4px", borderColor: (theme) => theme.palette.superGreen.border, backgroundColor: (theme) => theme.palette.superGreen.bg}}>
          <ListItemButton onClick={() => props.setSection("account")}>
              <ListItemIcon>
                {avatarComponent}
              </ListItemIcon>
              <ListItemText primary={auth.user?.profile.name || t('LeftBar.account')} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemText primary={`Client ${config.REACT_APP_VERSION} (${config.REACT_APP_BUILD})`} secondary={`Server ${profile.data?.results[0]?.app_version?.version}-${profile.data?.results[0]?.app_version?.environment}`} />
          </ListItem>
        </List>
      </Box>
      <Divider orientation="vertical"/>
    </Stack>
  );
}

export default LeftBar;
