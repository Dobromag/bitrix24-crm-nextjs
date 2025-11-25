import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../server/getDashboardData";
import type { DashboardData } from "../types";

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });
};
