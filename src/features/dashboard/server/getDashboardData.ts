// src/features/dashboard/server/getDashboardData.ts
import { getOrders } from "@/features/orders/server/getOrders";
import { mockOrders } from "@/features/orders/server/mockOrders";
import { getPayments } from "@/features/payments/server/getPayments";
import { mockPayments } from "@/features/payments/server/mockPayments";
import { getUser } from "@/features/profile/server/actions";
import { mockStreamData } from "@/features/stream/server/mockStream";
import type { DashboardData } from "../types";

const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL?.trim();

export async function getDashboardData(): Promise<DashboardData> {
  const user = await getUser(); // Всегда берем profile из DB

  if (!BITRIX_WEBHOOK_URL) {
    console.info(
      "Bitrix webhook not set → using mock dashboard data with real profile"
    );
    return {
      orders: mockOrders.slice(0, 8),
      profile: user,
      payments: mockPayments.slice(0, 5),
      stream: {
        previewUrl: "/images/stream/stream.jpg",
        stats: mockStreamData.stats,
      },
    };
  }

  try {
    const [orders, payments] = await Promise.all([getOrders(), getPayments()]);
    return {
      orders: orders.slice(0, 8),
      profile: user,
      payments: payments.slice(0, 5),
      stream: {
        previewUrl: mockStreamData.thumbnailUrl,
        stats: mockStreamData.stats,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data from Bitrix:", error);
    return {
      orders: mockOrders.slice(0, 8),
      profile: user,
      payments: mockPayments.slice(0, 5),
      stream: {
        previewUrl: "/images/stream/stream.jpg",
        stats: mockStreamData.stats,
      },
    };
  }
}
