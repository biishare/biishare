import axios from "axios";
import { resolveBrowserApiBaseUrl } from "./api-base-url";

export const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.baseURL = resolveBrowserApiBaseUrl();
  return config;
});
