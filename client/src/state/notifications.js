import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    open: false,
    type: "info",
    message: "",
    timeout: 6000
};

export const notificationSlice = createSlice({
    name: "notifs",
    initialState,
    reducers: {
        addNotification: (_state, action) => ({
            ...initialState,
            ...action.payload,
            open: true
        }),
        clearNotification: (state) => ({ ...state, open: false })
    }
});

export const {addNotification, clearNotification} = notificationSlice.actions;
export default notificationSlice.reducer;