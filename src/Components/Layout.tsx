import { Box, CssBaseline, Divider, List, Stack, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import LeftBar from './LeftBar';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Settings from '../Pages/Settings';
import ProjectsList from '../Pages/Projects/ProjectList';
import TemplateList from '../Pages/Templates/TemplateList';

/*const views: {name: string, component: FC, args: object}[] = [
  {name: "projects", component: ListView, args: {projectView: true}},
  {name: "templates", component: ListView, args: {projectView: false}},
  {name: "settings", component: Settings, args: {}}
]*/

const Layout = () => {

  const navigate = useNavigate()

  return (
    <Stack width={"100vw"} height={"100vh"} direction="row" bgcolor={"background.default"} color={"text.primary"}>
      <LeftBar setSection={(to: string) => navigate(`/${to}`)} />
      <Stack direction={"row"} flexGrow={1} justifyContent="center">
        <Box pl={2} pr={2} flexGrow={1} flex={1} maxWidth={1800} overflow="auto">
          <Outlet/>
        </Box>
      </Stack>
    </Stack>
  );
}

export default Layout;

/*
<Box width={700}>
{views.map((view, index) =>
  <Box sx={{display: section===view.name ? "block" : "none"}}>
    {React.createElement(view.component, view.args, '')}
  </Box>
)}
</Box>
*/