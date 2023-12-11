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

  const leftBarBox = useRef<any>(null)
  const [leftBarWidth, setLeftBarWidth] = useState(0)
  useEffect(() => {
    setLeftBarWidth(leftBarBox.current.offsetWidth)
  } ,[])

  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <Box position="fixed" ref={leftBarBox}>
        <LeftBar setSection={(to: string) => navigate(`/${to}`)} />
      </Box>
      <Stack direction="row" justifyContent="center" height="100vh">
        <Box minWidth={leftBarWidth+1}/>
        <Box width={"75%"}>
          <Outlet/>
        </Box>
      </Stack>
    </Box>
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