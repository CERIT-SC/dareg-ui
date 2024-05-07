export {}

declare global {
    interface Window {
        REACT_APP_BASE_URL: string;
        REACT_APP_BASE_API_URL: string;
        REACT_APP_BASE_ONEZONE_URL: string;
        REACT_APP_OIDC_REDIRECT_URL: string,
        REACT_APP_OIDC_AUTHORITY: string,
        REACT_APP_OIDC_CLIENT_ID: string,
        REACT_APP_OIDC_SCOPE: string,
        REACT_APP_OIDC_METADATA_issuer: string,
        REACT_APP_OIDC_METADATA_jwks_uri: string,
        REACT_APP_OIDC_METADATA_authorization_endpoint: string,
        REACT_APP_OIDC_METADATA_token_endpoint: string,
        REACT_APP_OIDC_METADATA_userinfo_endpoint: string,
        REACT_APP_OIDC_METADATA_end_session_endpoint: string
        REACT_APP_VERSION_DATE: string,
        REACT_APP_VERSION: string,
        REACT_APP_ENVIRONMENT: string,
    }
}
