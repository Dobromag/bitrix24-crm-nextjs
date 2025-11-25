import { useQuery } from "@tanstack/react-query";
import { getUser } from "../server/actions";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getUser,
    refetchOnWindowFocus: true,
  });
};
