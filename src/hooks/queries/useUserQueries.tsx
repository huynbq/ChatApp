import { useQuery } from "@tanstack/react-query";

import { userApi } from "@/api/userApi";
import { queryKeys } from "@/constants/queryKeys";

export const useUsersQuery = ({
  enabled = true,
  search = "",
}: {
  enabled?: boolean;
  search: string;
}) =>
  useQuery({
    enabled,
    queryFn: () => userApi.getUsers({ search }),
    queryKey: queryKeys.user.list(search),
  });
