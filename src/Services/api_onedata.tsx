import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { RootState } from "./store"
import config from "../Config"
import { useAuth } from "react-oidc-context"
import { User } from "oidc-client-ts"

const getUser = () => {
  const oidcStorage = sessionStorage.getItem(`oidc.user:${config.REACT_APP_OIDC_AUTHORITY}:${config.REACT_APP_OIDC_CLIENT_ID}`)
  if (!oidcStorage) {
      return null;
    }
  return User.fromStorageString(oidcStorage);
}

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
    baseUrl: config.REACT_APP_BASE_API_URL.replace("api", "onedata-api"),
    prepareHeaders: (headers, { getState }) => {
      const token = getUser()?.access_token
      console.log(token)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  })
  
  const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

  export const onedata_api = createApi({
    /**
     * `reducerPath` is optional and will not be required by most users.
     * This is useful if you have multiple API definitions,
     * e.g. where each has a different domain, with no interaction between endpoints.
     * Otherwise, a single API definition should be used in order to support tag invalidation,
     * among other features
     */
    reducerPath: 'onedata_api',
    /**
     * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
     */
    baseQuery: baseQuery,
    /**
     * Tag types must be defined in the original API definition
     * for any tags that would be provided by injected endpoints
     */
    tagTypes: ['Files'],
    /**
     * This api has endpoints injected in adjacent files,
     * which is why no endpoints are shown below.
     * If you want all endpoints defined in the same file, they could be included here instead
     */
    endpoints: () => ({}),
  })

  export const enhancedApi = onedata_api.enhanceEndpoints({
    endpoints: () => ({
      getPost: () => 'test',
    }),
  })