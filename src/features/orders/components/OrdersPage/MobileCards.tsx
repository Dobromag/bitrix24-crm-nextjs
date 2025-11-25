import { Box } from "@mui/material";
import type { Deal } from "../../types";
import { OrderCard } from "../OrderCard/OrderCard";

interface MobileCardsProps {
  orders: Deal[];
  onRepeat: (id: string) => Promise<string>;
  isRepeating: boolean;
}

export const MobileCards = ({
  orders,
  onRepeat,
  isRepeating,
}: MobileCardsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onRepeat={onRepeat}
          isRepeating={isRepeating}
        />
      ))}
    </Box>
  );
};
