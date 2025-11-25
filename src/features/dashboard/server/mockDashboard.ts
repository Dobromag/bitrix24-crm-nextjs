import { mockOrders } from "@/features/orders/server/mockOrders";
import { mockPayments } from "@/features/payments/server/mockPayments";
import { mockStreamData } from "@/features/stream/server/mockStream";
import type { DashboardData } from "../types";

export const mockDashboardData: DashboardData = {
  orders: mockOrders.slice(0, 8), // 8 mock карточек for Swiper
  profile: {
    id: 1,
    name: "Алим Джокоджаев",
    email: "name@mail.ru",
    phone: "+7 (123) 456-78-90",
    address: "Город, улица, дом",
    avatar: "/images/icons/default-avatar.svg",
    bitrix_contact_id: null,
  },
  payments: mockPayments.slice(0, 5), // Preview for payments block
  stream: {
    previewUrl: "/images/stream/stream.jpg",
    stats: mockStreamData.stats,
  },
};
