import { apiClient } from "@/api/http";
import type { ProfileUser } from "@/types/types";

export const userApi = {
  getUsers: async ({ search = "" }: { search?: string }) => {
    const { data } = await apiClient.get<ProfileUser[]>(`/users/search`, {
      params: {
        q: search,
      },
    });
    return data;
  },
};
