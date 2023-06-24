import { Snackbar, Alert, SnackbarCloseReason } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./../state";
import { useNotification } from "./../utils/useNotification";

export const Notification = () => {
    const notification = useSelector((state) => state.notifs);
    const { clearNotificationAction } = useNotification();

    const handleClose = (event, reason) =>
        reason !== "clickaway" && clearNotificationAction();

    return (
        <Snackbar
            open={notification.open}
            autoHideDuration={notification.timeout}
            onClose={handleClose}
        >
        <Alert
            variant="filled"
            onClose={handleClose}
            severity={notification.type}
        >
            {notification.message}
        </Alert>
        </Snackbar>
    );
};