import { Box, Card, CardContent, CardMedia, CircularProgress, Divider, Typography } from "@mui/material";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";
import ceitec_logo from '../ceitec_logo.png'
import { setCredentials } from "../Reducers/authSlice";
import { User } from "oidc-client-ts";

type UserStateCallback = {
    auth_request_id: string
}
const OIDCCallback = () => {
    const auth = useAuth();

    let redirect = "/";

    if (auth.isAuthenticated && !auth.isLoading) {
        setCredentials({ user: auth.user || {} as User, token: auth.user?.access_token || ""})
        const authRequestId = (auth.user?.state as UserStateCallback).auth_request_id;
        const o = JSON.parse(localStorage.getItem(authRequestId) as string)
        if (authRequestId && o) { 
            redirect = o.redirect;
            localStorage.removeItem(authRequestId)
        }
    };

    return (
        !auth.isLoading && auth.isAuthenticated ? (
                <Navigate to={redirect} />
            ) : (
            <Card variant="outlined" sx={{ width: 400 }}>
                <CardContent>
                <CardMedia
                    component="img"
                    image={ceitec_logo}
                    />
                    <Typography align='center'>DAREG - Dataset Registry</Typography>
                    <Divider variant='middle' sx={{mt: 2, mb:2 }}></Divider>
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                </CardContent>
            </Card>
            )
    )
}

export default OIDCCallback;
