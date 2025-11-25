// src/features/orders/components/OrderCard/OrderCard.tsx
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_TEXT,
} from "@/features/orders/lib/orderStatus";
import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";
import type { Deal } from "../../types";

interface OrderCardProps {
  order: Deal;
  onRepeat: (id: string) => Promise<string>;
  isRepeating: boolean;
}

export const OrderCard = memo(
  ({ order, onRepeat, isRepeating }: OrderCardProps) => {
    const statusText = ORDER_STATUS_TEXT[order.stageId] || "Статус";
    const statusColor = ORDER_STATUS_COLOR[order.stageId] || "#000";

    const handleRepeat = async () => {
      await onRepeat(order.bitrixDealId);
    };

    return (
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 1, bgcolor: "#fff" }}>
        {/* Статус */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: statusColor,
              borderRadius: "50%",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {statusText}
          </Typography>
        </Box>

        {/* Заголовок */}
        <Typography variant="h6" fontWeight={600}>
          {order.title}
        </Typography>

        {/* Дата */}
        <Typography variant="body2" color="text.secondary">
          Дата заказа
        </Typography>
        <Typography variant="body1">{order.dateCreate}</Typography>

        {/* Кнопка повторить */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleRepeat}
          disabled={isRepeating}
          sx={{ mt: 1, width: "100%" }}
        >
          {isRepeating ? "Повтор..." : "Повторить заказ"}
        </Button>
      </Box>
    );
  }
);

OrderCard.displayName = "OrderCard";
