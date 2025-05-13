import axios from "axios";

export const API_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;
export const NOTIFICATION_URL: string | undefined = process.env.NEXT_PUBLIC_NOTIFICATION_URL;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const notificationApi = axios.create({
    baseURL: NOTIFICATION_URL,
    withCredentials: true,
});
