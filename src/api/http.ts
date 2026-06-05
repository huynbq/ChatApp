import axios, { AxiosHeaders } from "axios";

import { API_BASE_URL } from "@/constants/api";
import { supabase } from "@/lib/supabase";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const headers = AxiosHeaders.from(config.headers);

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  }

  if (data.session?.access_token) {
    headers.set("Authorization", `Bearer ${data.session.access_token}`);
  }

  config.headers = headers;

  return config;
});
