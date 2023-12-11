import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { hasAuthParams, useAuth } from 'react-oidc-context';
import Login from '../Pages/Login';

const AuthenticatedRoute = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
        navigate("/login", {state: {from: location.pathname}});
    }
    return <Outlet />;
  };

export default AuthenticatedRoute;

