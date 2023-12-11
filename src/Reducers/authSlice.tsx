import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User, UserManager } from "oidc-client-ts";
import type { RootState } from '../Services/store'
import config from "../Config";
  
  const slice = createSlice({
    name: 'auth',
    initialState: {} as User,
    reducers: {
      setCredentials: (
        state,
        { payload: { user } }: PayloadAction<{ user: User; token: string }>
      ) => {
        state.access_token = user.access_token
        state.profile = user.profile
      },
    },
  })
  
  export const { setCredentials } = slice.actions
  
  export default slice.reducer
  
  export const selectCurrentUser = (state: RootState) => state.auth.profile
  