import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IsAliveState = {
    isAlive: boolean | undefined;
}

const initialState: IsAliveState = {
    isAlive: undefined,
};

export const isOAliveSlice = createSlice({
    name: "isOAliveSlice",
    initialState,
    reducers: {
        setIsOAlive: (state, action: PayloadAction<boolean>) => {
            state.isAlive = action.payload
        }
    }
})

export const { setIsOAlive } = isOAliveSlice.actions;