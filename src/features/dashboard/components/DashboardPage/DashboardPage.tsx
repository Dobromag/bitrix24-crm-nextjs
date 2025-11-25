// src/features/dashboard/components/DashboardPage/DashboardPage.tsx
"use client";
import { SkeletonTable } from "@/features/orders/components/OrdersPage/SkeletonTable"; // Reuse
import { Box, Typography } from "@mui/material";
import { useDashboard } from "../../hooks/useDashboard";
import { OrdersSlider } from "../OrdersSlider/OrdersSlider";
import { PaymentsBlock } from "../PaymentsBlock/PaymentsBlock";
import { ProfileBlock } from "../ProfileBlock/ProfileBlock";
import { StreamPreview } from "../StreamPreview/StreamPreview";
import styles from "./DashboardPage.module.scss";
export const DashboardPage = () => {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) return <SkeletonTable />; // Добавлена проверка !data
  return (
    <Box className={styles.container}>
      <Typography
        className={styles.title}
        sx={{
          gridColumn: "1 / -1",
          fontWeight: 400,
          fontSize: {
            xs: "26px",
            sm: "30px",
            md: "38px",
            lg: "48px",
          },
          lineHeight: 1.2,
        }}
      >
        Привет, {data.profile.name} 👋
      </Typography>
      <OrdersSlider
        orders={data.orders}
        sx={{ gridColumn: { xs: "1 / -1", md: "span 3" } }}
      />

      <ProfileBlock
        profile={data.profile}
        sx={{ gridColumn: { xs: "1 / -1", md: "span 1" } }}
      />

      <StreamPreview
        stream={data.stream}
        sx={{ gridColumn: { xs: "1 / -1", md: "span 2" } }}
      />

      <PaymentsBlock
        payments={data.payments}
        sx={{ gridColumn: { xs: "1 / -1", md: "span 2" } }}
      />
    </Box>
  );
};
