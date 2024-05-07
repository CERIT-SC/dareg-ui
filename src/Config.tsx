const config = {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL || window.REACT_APP_BASE_URL,
    REACT_APP_BASE_API_URL: process.env.REACT_APP_BASE_API_URL || window.REACT_APP_BASE_API_URL,
    REACT_APP_BASE_ONEZONE_URL: process.env.REACT_APP_BASE_ONEZONE_URL || window.REACT_APP_BASE_ONEZONE_URL,
    REACT_APP_OIDC_REDIRECT_URL: process.env.REACT_APP_OIDC_REDIRECT_URL || window.REACT_APP_OIDC_REDIRECT_URL,
    REACT_APP_OIDC_AUTHORITY: process.env.REACT_APP_OIDC_AUTHORITY || window.REACT_APP_OIDC_AUTHORITY,
    REACT_APP_OIDC_CLIENT_ID: process.env.REACT_APP_OIDC_CLIENT_ID || window.REACT_APP_OIDC_CLIENT_ID,
    REACT_APP_OIDC_SCOPE: process.env.REACT_APP_OIDC_SCOPE || window.REACT_APP_OIDC_SCOPE,
    REACT_APP_OIDC_METADATA_issuer: process.env.REACT_APP_OIDC_METADATA_issuer || window.REACT_APP_OIDC_METADATA_issuer,
    REACT_APP_OIDC_METADATA_jwks_uri: process.env.REACT_APP_OIDC_METADATA_jwks_uri || window.REACT_APP_OIDC_METADATA_jwks_uri,
    REACT_APP_OIDC_METADATA_authorization_endpoint: process.env.REACT_APP_OIDC_METADATA_authorization_endpoint || window.REACT_APP_OIDC_METADATA_authorization_endpoint,
    REACT_APP_OIDC_METADATA_token_endpoint: process.env.REACT_APP_OIDC_METADATA_token_endpoint || window.REACT_APP_OIDC_METADATA_token_endpoint,
    REACT_APP_OIDC_METADATA_userinfo_endpoint: process.env.REACT_APP_OIDC_METADATA_userinfo_endpoint || window.REACT_APP_OIDC_METADATA_userinfo_endpoint,
    REACT_APP_OIDC_METADATA_end_session_endpoint: process.env.REACT_APP_OIDC_METADATA_end_session_endpoint || window.REACT_APP_OIDC_METADATA_end_session_endpoint,
}

export default config;