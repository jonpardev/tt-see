import { configureStore } from "@reduxjs/toolkit"
import { globalThemeSlice } from "./globalThemeSlice"

export const store = configureStore({
    reducer: {
        globalTheme: globalThemeSlice.reducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>