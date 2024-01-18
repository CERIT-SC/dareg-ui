import { Box, CssBaseline, Divider, List, Stack, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import LeftBar from './LeftBar';
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Settings from '../Pages/Settings';
import ProjectsList from '../Pages/Projects/ProjectList';
import TemplateList from '../Pages/Templates/TemplateList';

const LoginLayout = () => {

  const navigate = useNavigate()

  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <Stack direction="row" height="100vh">
        <Box sx={{width: "100%"}}>
          <Outlet/>
        </Box>
      </Stack>
    </Box>
  );
}

export default LoginLayout;