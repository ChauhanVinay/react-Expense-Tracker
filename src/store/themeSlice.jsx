import { createSlice } from '@reduxjs/toolkit';

const initialThemeState = {
    isPremium: false,
    isDarkTheme: false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState: initialThemeState,
    reducers: {
        activatePremium(state) {
            state.isPremium = true;
        },
        toggleTheme(state) {
            state.isDarkTheme = !state.isDarkTheme;
        }
    },
});    

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;