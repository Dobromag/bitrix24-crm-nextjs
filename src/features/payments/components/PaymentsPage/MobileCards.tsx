import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Payment } from "../../types";
import { PayButton } from "../PayButton/PayButton";

interface MobileCardsProps {
  payments: Payment[];
  onPay: (id: string) => Promise<void>;
  isPaying: boolean;
}

export const MobileCards = ({
  payments,
  onPay,
  isPaying,
}: MobileCardsProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {payments.map((payment) => {
        const statusColor = {
          paid: "#4caf50",
          unpaid: "#ff9800",
          overdue: "#f44336",
        }[payment.status];

        const statusText = {
          paid: "Оплачено",
          unpaid: "Не оплачено",
          overdue: "Просрочено",
        }[payment.status];

        return (
          <Card key={payment.id} elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body1" fontWeight={600}>
                Номер: {payment.invoiceNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Дата: {payment.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Сумма: {payment.amountFormatted}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: statusColor, fontWeight: 600, mt: 1 }}
              >
                Статус: {statusText}
              </Typography>
              {payment.status !== "paid" && (
                <Box sx={{ mt: 2 }}>
                  <PayButton
                    invoiceId={payment.bitrixInvoiceId}
                    onPay={onPay}
                    isPaying={isPaying}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
