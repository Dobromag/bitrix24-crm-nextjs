export type DealStatus =
  | "NEW"
  | "PREPARATION"
  | "PREPAYMENT_INVOICE"
  | "EXECUTING"
  | "FINAL_INVOICE"
  | "CLOSED"
  | "WON"
  | "LOST"; // Стандартные STAGE_ID Bitrix, адаптируй

export interface Deal {
  id: string;
  title: string;
  dateCreate: string; // "16.03.2025"
  stageId: DealStatus;
  bitrixDealId: string;
  opportunity?: number;
  currencyId?: string;
  categoryId?: string;
  sourceId?: string;
  comments?: string;
  // Добавь UF_* если нужно
}

export interface OrdersFilters {
  search: string;
  status: DealStatus | "all";
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;
}
