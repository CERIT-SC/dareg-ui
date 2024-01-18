import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAuth, hasAuthParams } from 'react-oidc-context';
import ceitec_logo from '../ceitec_logo.png'
import { useLocation } from 'react-router-dom';
import useLocalStorage from '../Utils/useLocalStorage';

const Login = () => {

  const auth = useAuth();
  const location = useLocation();
  const r = "dareg-"+(Math.random() + 1).toString(36).substring(7);
  const [authNonce, setAuthNonce] = useLocalStorage(r, "none");

  const [tab, setTab] = useState("login");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newTab: string,
  ) => {
    if (newTab !== null)
      setTab(newTab);
  };

  const initLogin = () => {
    if (!hasAuthParams() &&
        !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
            const auth_state = {
                id: r,
                redirect: (location?.state?.from || "/").toString(),
                expires: new Date().toLocaleTimeString(),
            }
            setAuthNonce(auth_state);
        auth.signinRedirect({state: {"auth_request_id": r}});
    }
  };

  return (
    <Grid container direction={'row'} alignItems={'flex-start'}>
      <Grid item xs={12} md={3} >
        <Card variant="outlined" sx={{ m:1, height: '100%', mt: 10 }}>
          <CardContent>
            <CardMedia
              component="img"
              image={ceitec_logo}
            />
            <Typography variant='h5' align='center'>DAREG - Dataset Registry</Typography>
            <Divider variant='middle' sx={{ mt: 2, mb: 2 }}></Divider>
            <Button sx={{ mt: 1 }} size="large" variant="outlined" fullWidth onClick={() => initLogin()}>Log-in using CEITEC ID</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={9} sx={{ height: '100vh', backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundImage: `url(https://www.ceitec.eu/data/documents/images/thumb/41532-13-ulozeno-dkf-1600x0-c0.jpeg)` }}>
        <p>a</p>
      </Grid>
    </Grid>
  );
}

export default Login;
