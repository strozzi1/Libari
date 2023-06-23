import { useDispatch } from "react-redux";
import { addNotification, clearNotification } from "../state/notifications";

export const useNotification = () => {
    const dispatch = useDispatch();

    const displayNotificationAction = (notification) => {
        dispatch(addNotification(notification));
    };

    const clearNotificationAction = () => {
        dispatch(clearNotification());
    };

    return { displayNotificationAction, clearNotificationAction } ;
};