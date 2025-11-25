import type { StreamData } from "../types";

export const mockStreamData: StreamData = {
  title: "Прямая трансляция",
  description: "Следите за процессом выполнения заказов в реальном времени.",
  status: "live",
  thumbnailUrl: "/images/stream-full.jpg",
  stats: {
    activeOrders: 12,
    onlineEmployees: 3,
    viewers: 47,
  },
};
