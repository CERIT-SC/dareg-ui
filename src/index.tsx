import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n'
import config from './Config';
import { WebStorageStateStore } from 'oidc-client-ts';
import { AuthProvider } from 'react-oidc-context';
import { Provider } from 'react-redux';
import { store } from './Services/store';

const oidcConfig = {
  authority: config.REACT_APP_OIDC_AUTHORITY,
  client_id: config.REACT_APP_OIDC_CLIENT_ID,
  scope: config.REACT_APP_OIDC_SCOPE,
  response_type: "code",
  // In case of e-infra cz use http://localhost:3000
  redirect_uri: (new URL(config.REACT_APP_OIDC_REDIRECT_URL, window.location.origin)).href,
  metadata: {
    issuer: config.REACT_APP_OIDC_METADATA_issuer,
    jwks_uri: config.REACT_APP_OIDC_METADATA_jwks_uri,
    authorization_endpoint: config.REACT_APP_OIDC_METADATA_authorization_endpoint,
    token_endpoint: config.REACT_APP_OIDC_METADATA_token_endpoint,
    userinfo_endpoint: config.REACT_APP_OIDC_METADATA_userinfo_endpoint,
    end_session_endpoint: config.REACT_APP_OIDC_METADATA_end_session_endpoint,
  },
  automaticSilentRenew: false,
  checkSessionIntervalInSeconds: 3600,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.8em 0',
        },
      }
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider {...oidcConfig}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
