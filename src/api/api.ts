import axios from "axios";

export const API_URL: string | undefined = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
