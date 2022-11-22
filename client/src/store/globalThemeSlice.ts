import { createSlice } from "@reduxjs/toolkit";

const isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialState = {
    isDark: isDarkPreferred,
};

export const globalThemeSlice = createSlice({
    name: "globalThemeSlice",
    initialState,
    reducers: {
        setThemeLight: state => {
            state.isDark = false;
        },
        setThemeDark: state => {
            state.isDark = true;
        },
        setThemeSystem: state => {
            state.isDark = isDarkPreferred;
        }
    }
})

export const { setThemeLight, setThemeDark, setThemeSystem } = globalThemeSlice.actions;