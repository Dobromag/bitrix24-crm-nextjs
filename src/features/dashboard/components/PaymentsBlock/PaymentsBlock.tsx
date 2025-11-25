// src/features/dashboard/components/PaymentsBlock/PaymentsBlock.tsx
import { DashboardBlockTitle } from "@/features/dashboard/ui/DashboardBlockTitle/DashboardBlockTitle";
import { PaymentRow } from "@/features/payments/components/PaymentRow/PaymentRow";
import { usePayments } from "@/features/payments/hooks/usePayments";
import type { Payment } from "@/features/payments/types";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useMemo, useState } from "react";
import styles from "./PaymentsBlock.module.scss";

interface PaymentsBlockProps {
  payments: Payment[];
  sx?: SxProps<Theme>;
}

export const PaymentsBlock = ({ payments, sx }: PaymentsBlockProps) => {
  const { payInvoice, isPaying } = usePayments();
  const [filter, setFilter] = useState<string>("all");

  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) => filter === "all" || p.status === filter)
      .slice(0, 5);
  }, [payments, filter]);

  return (
    <Box
      className={styles.paymentsBlock}
      sx={{
        ...sx,
        maxWidth: "100%",
      }}
    >
      <DashboardBlockTitle>Платежи</DashboardBlockTitle>

      <FormControl size="small" sx={{ mb: 2, minWidth: 150 }}>
        <InputLabel>Фильтр</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as string)}
          label="Фильтр"
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="paid">Оплачено</MenuItem>
          <MenuItem value="unpaid">Не оплачено</MenuItem>
          <MenuItem value="overdue">Просрочено</MenuItem>
        </Select>
      </FormControl>

      {/* Таблица с горизонтальным скроллом при необходимости */}
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <Table size="small">
          <TableBody>
            {filteredPayments.map((payment) => (
              <PaymentRow
                key={payment.id}
                payment={payment}
                onPay={payInvoice}
                isPaying={isPaying}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography className={styles.moreLink} sx={{ mt: 1, display: "block" }}>
        Все платежи →
      </Typography>
    </Box>
  );
};
