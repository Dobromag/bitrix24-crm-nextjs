import type { Payment } from "../types";

export const mockPayments: Payment[] = Array.from({ length: 48 }, (_, i) => ({
  id: `mock-${i + 1}`,
  invoiceNumber: `321312321`,
  date: "16.03.2025",
  amount: 15000,
  amountFormatted: "15,000 тг",
  status: i === 0 ? "unpaid" : Math.random() > 0.8 ? "overdue" : "paid",
  bitrixInvoiceId: `INV-${1000 + i}`,
}));
