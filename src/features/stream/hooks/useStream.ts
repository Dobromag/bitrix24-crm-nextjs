import { useQuery } from "@tanstack/react-query";
import type { StreamData } from "../types";

export const useStream = () => {
  return useQuery<StreamData>({
    queryKey: ["stream"],
    queryFn: async () => {
      // Пока мок
      return {
        title: "Прямая трансляция",
        description: "Склад в реальном времени",
        status: "live" as const,
        thumbnailUrl: "/images/stream-full.jpg",
        stats: { activeOrders: 12, onlineEmployees: 3, viewers: 47 },
      };
    },
    staleTime: 30_000,
  });
};
