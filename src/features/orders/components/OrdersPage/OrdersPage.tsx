"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import type { Deal, OrdersFilters } from "../../types";
import { DesktopTable } from "./DesktopTable";
import { Filters } from "./Filters";
import { MobileCards } from "./MobileCards";
import styles from "./OrdersPage.module.scss";
import { SkeletonTable } from "./SkeletonTable";

export const OrdersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { orders, isLoading, repeatOrder, isRepeating } = useOrders();

  const [filters, setFilters] = useState<OrdersFilters>({
    search: "",
    status: "all",
  });

  const filteredOrders = useMemo((): Deal[] => {
    return orders.filter((o) => {
      if (filters.status !== "all" && o.stageId !== filters.status)
        return false;
      if (filters.search && !o.title.includes(filters.search)) return false;
      const orderDate = new Date(o.dateCreate.split(".").reverse().join("-"));
      if (filters.dateFrom && orderDate < new Date(filters.dateFrom))
        return false;
      if (filters.dateTo && orderDate > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [orders, filters]);

  return (
    <Box className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        Заказы
      </Typography>

      <Filters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <SkeletonTable />
      ) : isMobile ? (
        <MobileCards
          orders={filteredOrders}
          onRepeat={repeatOrder}
          isRepeating={isRepeating}
        />
      ) : (
        <DesktopTable
          orders={filteredOrders}
          onRepeat={repeatOrder}
          isRepeating={isRepeating}
        />
      )}
    </Box>
  );
};
