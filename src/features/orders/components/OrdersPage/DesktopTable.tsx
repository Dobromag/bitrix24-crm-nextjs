import { Box } from "@mui/material";
import type { Deal } from "../../types";
import { OrderCard } from "../OrderCard/OrderCard";

interface DesktopTableProps {
  orders: Deal[];
  onRepeat: (id: string) => Promise<string>;
  isRepeating: boolean;
}

export const DesktopTable = ({
  orders,
  onRepeat,
  isRepeating,
}: DesktopTableProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 2,
      }}
    >
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
