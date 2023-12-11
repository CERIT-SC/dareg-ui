import { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Pages/Login';
import ProjectsList from './Pages/Projects/ProjectList';
import TemplateList from './Pages/Templates/TemplateList';
import DatasetCard from './Components/DatasetCard';
import LoginLayout from './Components/LoginLayout';
import AuthenticatedRoute from './Components/AuthenticatedRoute';
import OIDCCallback from './Components/OIDCCallback';
import Profile from './Pages/Profile';
import TemplatesNew from './Pages/Templates/TemplatesEdit';
import TemplateView from './Pages/Templates/TemplateView';
import { CachePolicies, Provider } from 'use-http';
import { User } from 'oidc-client-ts';
import config from './Config';
import ProjectEdit from './Pages/Projects/ProjectEdit';
import DatasetView from './Pages/Datasets/DatasetView';
import { ViewModes } from './types/enums';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [selectedTheme, setSelectedTheme] = useState<"dark"|"light"|"system">("system")
  const darkTheme = createTheme({
    palette: {
      mode: selectedTheme==="system" ? (prefersDarkMode ? "light" : "dark") : selectedTheme
    }
  })

const getUser = () => {
  const oidcStorage = sessionStorage.getItem(`oidc.user:${config.REACT_APP_OIDC_AUTHORITY}:${config.REACT_APP_OIDC_CLIENT_ID}`)
  if (!oidcStorage) {
      return null;
    }
  return User.fromStorageString(oidcStorage);
}

const options = {
  interceptors: {
    request: ({ options }: any) => {
      const u = getUser();
      options.headers.Authorization = `Bearer ${u?.access_token}`
      return options
    }
  },
  "headers": {
    "Content-Type": "application/json"
  },
  cachePolicy: CachePolicies.NO_CACHE,
  retries: 1,
  retryOn: async ({ error, response }: any) => {
    return error || (response && response.status >= 300)
  },

  retryDelay: ({ attempt }: any) => {
    return Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  }
}
  return (
    <Provider url={config.REACT_APP_BASE_API_URL} options={options}>
      <BrowserRouter>
        <CssBaseline/>
        <ThemeProvider theme={darkTheme}>
              <Routes>
                <Route element={<AuthenticatedRoute />}>
                  <Route path='/' element={<Layout />} >
                    <Route index element={<ProjectsList />} />

                    <Route path='projects'>
                      <Route index element={<ProjectsList />} />
                      <Route path='new' element={<ProjectEdit mode={ViewModes.New} />} />
                      <Route path=':projectId' element={<ProjectEdit mode={ViewModes.View} />} />
                      <Route path=':projectId/edit' element={<ProjectEdit mode={ViewModes.Edit} />} />
                      <Route path=':projectId/datasets' element={<DatasetCard />} />
                      <Route path=':projectId/datasets/new' element={<DatasetView mode={ViewModes.New} />} />
                      <Route path=':projectId/datasets/:datasetId' element={<DatasetView mode={ViewModes.View} />} />
                      <Route path=':projectId/datasets/:datasetId/edit' element={<DatasetView mode={ViewModes.Edit} />} />
                      {/* <Route path=':projId'>
                        <Route index element={<ListCard/>} />
                        <Route path='dataset' element={<DatasetCard />}>
                          <Route path=':datasetId/edit' element={<ProjectEdit editMode={true} />} />
                        </Route>
                      </Route> */}
                    </Route>
                    
                    <Route path='templates'>
                      <Route index element={<TemplateList />} />
                      <Route path=':templateId' element={<TemplateView />}>
                      </Route>
                      <Route path=':templateId/edit' element={<TemplatesNew mode={ViewModes.Edit} />} />
                      <Route path='new' element={<TemplatesNew mode={ViewModes.New} />} />
                    </Route>
                    
                    <Route path='account' element={<Profile selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />} />
                  </Route>
                </Route>
                <Route element={<LoginLayout />} >
                  <Route path='login' element={<Login/>} />
                  <Route path="/auth" element={< OIDCCallback />} />
                </Route>
              </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
