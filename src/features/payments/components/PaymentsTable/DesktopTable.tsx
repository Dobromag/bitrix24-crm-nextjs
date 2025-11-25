import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Payment } from "../../types";
import { PaymentRow } from "../PaymentRow/PaymentRow";

interface DesktopTableProps {
  payments: Payment[];
  onPay: (id: string) => Promise<void>;
  isPaying: boolean;
}

export const DesktopTable = ({
  payments,
  onPay,
  isPaying,
}: DesktopTableProps) => {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ borderRadius: 3, overflow: "hidden" }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8f9fc" }}>
            <TableCell>
              <Typography fontWeight={600}>Номер счета</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>Дата</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>Сумма</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>Статус</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={600}>Действие</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              onPay={onPay}
              isPaying={isPaying}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
