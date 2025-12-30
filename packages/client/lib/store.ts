import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import navbarReducer from './slices/navbarSlice'

export const store = configureStore({
   reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      navbar: navbarReducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
