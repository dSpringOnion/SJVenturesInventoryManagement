import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
    language: "en" | "zh";
}

const initialState: GlobalState = {
    language: "en", // default to English
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        toggleLanguage: (state) => {
            state.language = state.language === "en" ? "zh" : "en"; // Toggle between English and Chinese
        },
        setLanguage: (state, action: PayloadAction<"en" | "zh">) => {
            state.language = action.payload;
        },
    },
});

export const { toggleLanguage, setLanguage } = globalSlice.actions;
export default globalSlice.reducer;
