import type { Deal, DealStatus } from "../types";

export const mockOrders: Deal[] = Array.from({ length: 10 }, (_, i) => ({
  id: `mock-${i + 1}`,
  title: `Детали услуги`,
  dateCreate: "16.03.2025",
  stageId: ["NEW", "EXECUTING", "WON", "LOST"][i % 4] as DealStatus,
  bitrixDealId: `DEAL-${1000 + i}`,
  opportunity: 15000,
  currencyId: "RUB",
  categoryId: "1",
  sourceId: "WEB",
  comments: "Комментарий к сделке",
}));
