import type { Deal } from "@/features/orders/types";
import type { Payment } from "@/features/payments/types";
import type { UserData } from "@/features/profile/types";

export interface StreamPreviewData {
  // Изменено на StreamPreviewData
  previewUrl: string;
  stats: {
    activeOrders: number;
    onlineEmployees: number;
    viewers: number;
  };
}

export interface DashboardData {
  orders: Deal[]; // Preview (6-10)
  profile: UserData;
  payments: Payment[]; // For dropdown/filter preview
  stream: StreamPreviewData;
}
