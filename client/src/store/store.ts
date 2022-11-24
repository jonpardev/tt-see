import { configureStore } from "@reduxjs/toolkit"
import { globalThemeSlice } from "./globalThemeSlice"
import { isOAliveSlice } from "./isOAliveSlice"

export const store = configureStore({
    reducer: {
        globalTheme: globalThemeSlice.reducer,
        officialServer: isOAliveSlice.reducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>