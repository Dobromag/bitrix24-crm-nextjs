// src/features/payments/server/getPayments.ts
import type { Payment } from "../types";
import { mockPayments } from "./mockPayments";

const BITRIX_WEBHOOK = process.env.BITRIX_WEBHOOK_URL;

interface BitrixInvoice {
  ID: string;
  ACCOUNT_NUMBER?: string;
  DATE_INSERT: string;
  PRICE: string;
  STATUS_ID: string;
  UF_DEAL_ID?: string;
}

interface BitrixResponse {
  result: BitrixInvoice[];
}

export async function getPayments(): Promise<Payment[]> {
  if (!BITRIX_WEBHOOK) {
    console.info("Bitrix webhook not set → using mock data");
    return mockPayments;
  }

  try {
    const response = await fetch(
      `${BITRIX_WEBHOOK}/crm.invoice.list.json?select[]=ID&select[]=ACCOUNT_NUMBER&select[]=DATE_INSERT&select[]=PRICE&select[]=STATUS_ID&select[]=UF_DEAL_ID`
    );

    if (!response.ok) throw new Error("Bitrix API error");

    const data = (await response.json()) as BitrixResponse;

    return data.result.map((invoice: BitrixInvoice) => ({
      id: invoice.ID,
      invoiceNumber: invoice.ACCOUNT_NUMBER || invoice.ID,
      date: new Date(invoice.DATE_INSERT).toLocaleDateString("ru-RU"),
      amount: Number(invoice.PRICE),
      amountFormatted: `${Number(invoice.PRICE).toLocaleString("ru-RU")} тг`,
      status:
        invoice.STATUS_ID === "P"
          ? "paid"
          : invoice.STATUS_ID === "N"
          ? "unpaid"
          : "overdue",
      bitrixInvoiceId: invoice.ID,
      bitrixDealId: invoice.UF_DEAL_ID,
    }));
  } catch (error) {
    console.error("Failed to fetch payments from Bitrix:", error);
    return mockPayments;
  }
}
