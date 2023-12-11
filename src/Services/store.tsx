import { ConfigureStoreOptions, configureStore } from '@reduxjs/toolkit'
import authSlice from '../Reducers/authSlice'
import { api } from './api'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const createStore = (
    options?: ConfigureStoreOptions['preloadedState'] | undefined
  ) =>
    configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
        auth: authSlice,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
      ...options,
    })
  
export const store = createStore()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
