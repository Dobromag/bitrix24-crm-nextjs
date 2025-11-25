export type PaymentStatus = "paid" | "unpaid" | "overdue";

export interface Payment {
  id: string;
  invoiceNumber: string;
  date: string; // "16.03.2025"
  amount: number; // в тенге, без разделителей
  amountFormatted: string; // "15,000 тг"
  status: PaymentStatus;
  bitrixInvoiceId: string;
  bitrixDealId?: string;
}

export type PaymentsSortField = "invoiceNumber" | "date" | "amount" | "status";
export type SortOrder = "asc" | "desc";

export interface PaymentsFilters {
  search: string;
  status: PaymentStatus | "all";
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
}

export interface PaymentsSort {
  field: PaymentsSortField;
  order: SortOrder;
}
