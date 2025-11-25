// src/features/payments/components/PaymentsPage/PaymentsPage.tsx
"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { usePayments } from "../../hooks/usePayments";
import type { Payment, PaymentsFilters } from "../../types";
import { DesktopTable } from "../PaymentsTable/DesktopTable";
import { Filters } from "./Filters";
import { MobileCards } from "./MobileCards";
import styles from "./PaymentsPage.module.scss";
import { SkeletonTable } from "./SkeletonTable";

export const PaymentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { payments, isLoading, payInvoice, isPaying } = usePayments();

  const [filters, setFilters] = useState<PaymentsFilters>({
    search: "",
    status: "all",
  });

  const filteredPayments = useMemo((): Payment[] => {
    return payments.filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.search && !p.invoiceNumber.includes(filters.search))
        return false;
      // Фильтр по дате (преобразовать в Date для сравнения)
      const paymentDate = new Date(p.date.split(".").reverse().join("-"));
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (paymentDate < fromDate) return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        if (paymentDate > toDate) return false;
      }
      return true;
    });
  }, [payments, filters]);

  return (
    <Box className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        Платежи
      </Typography>

      <Filters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <SkeletonTable />
      ) : isMobile ? (
        <MobileCards
          payments={filteredPayments}
          onPay={payInvoice}
          isPaying={isPaying}
        />
      ) : (
        <DesktopTable
          payments={filteredPayments}
          onPay={payInvoice}
          isPaying={isPaying}
        />
      )}
    </Box>
  );
};
