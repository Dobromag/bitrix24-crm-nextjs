import { TableCell, TableRow, Typography } from "@mui/material";
import { memo } from "react";
import type { Payment } from "../../types";
import { PayButton } from "../PayButton/PayButton";

interface PaymentRowProps {
  payment: Payment;
  onPay: (id: string) => Promise<void>;
  isPaying: boolean;
}

export const PaymentRow = memo(
  ({ payment, onPay, isPaying }: PaymentRowProps) => {
    const { invoiceNumber, date, amountFormatted, status } = payment;

    const statusColor = {
      paid: "#4caf50",
      unpaid: "#ff9800",
      overdue: "#f44336",
    }[status];

    const statusText = {
      paid: "Оплачено",
      unpaid: "Не оплачено",
      overdue: "Просрочено",
    }[status];

    return (
      <TableRow hover sx={{ "&:last-child td": { border: 0 } }}>
        <TableCell>{invoiceNumber}</TableCell>
        <TableCell>{date}</TableCell>
        <TableCell>{amountFormatted}</TableCell>
        <TableCell>
          <Typography
            variant="body2"
            sx={{ color: statusColor, fontWeight: 600 }}
          >
            {statusText}
          </Typography>
        </TableCell>
        <TableCell>
          {status !== "paid" && (
            <PayButton
              invoiceId={payment.bitrixInvoiceId}
              onPay={onPay}
              isPaying={isPaying}
            />
          )}
        </TableCell>
      </TableRow>
    );
  }
);

PaymentRow.displayName = "PaymentRow";
