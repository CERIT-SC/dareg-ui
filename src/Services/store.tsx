import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import authSlice from '../Reducers/authSlice'
import { api } from './api'
import { onedata_api } from './api_onedata'
import { datacite_api } from './api_datacite'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const createStore = (
    options?: ConfigureStoreOptions['preloadedState'] | undefined
  ) =>
    configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
        [onedata_api.reducerPath]: onedata_api.reducer,
        [datacite_api.reducerPath]: datacite_api.reducer,
        auth: authSlice,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware).concat(onedata_api.middleware).concat(datacite_api.middleware),
      ...options,
    })
  
export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
