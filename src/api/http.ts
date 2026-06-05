import axios, { AxiosHeaders } from "axios";

import { getAccessToken } from "@/auth/accessToken";
import { API_BASE_URL } from "@/constants/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  const headers = AxiosHeaders.from(config.headers);

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;

  return config;
});
