import type { Deal, DealStatus } from "../types";
import { mockOrders } from "./mockOrders";

const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL?.trim();

interface BitrixDeal {
  ID: string;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
  OPPORTUNITY?: string;
  CURRENCY_ID?: string;
  CATEGORY_ID?: string;
  SOURCE_ID?: string;
  COMMENTS?: string;
}

interface BitrixResponse {
  result: BitrixDeal[];
  total: number;
  next?: number;
}

export async function getOrders(): Promise<Deal[]> {
  if (!BITRIX_WEBHOOK_URL) {
    console.info("Bitrix webhook not set → using mock data");
    return mockOrders;
  }

  const webhook = BITRIX_WEBHOOK_URL.replace(/\/+$/, "") + "/";
  const allDeals: Deal[] = [];
  let start = 0;
  const limit = 50; // Bitrix max per request

  try {
    while (true) {
      const response = await fetch(
        `${webhook}crm.deal.list.json?start=${start}&select[]=ID&select[]=TITLE&select[]=DATE_CREATE&select[]=STAGE_ID&select[]=OPPORTUNITY&select[]=CURRENCY_ID&select[]=CATEGORY_ID&select[]=SOURCE_ID&select[]=COMMENTS`
      );

      if (!response.ok) throw new Error("Bitrix API error");

      const data = (await response.json()) as BitrixResponse;

      allDeals.push(
        ...data.result.map((deal: BitrixDeal) => ({
          id: deal.ID,
          title: deal.TITLE || `Сделка ${deal.ID}`,
          dateCreate: new Date(deal.DATE_CREATE).toLocaleDateString("ru-RU"),
          stageId: deal.STAGE_ID as DealStatus,
          bitrixDealId: deal.ID,
          opportunity: deal.OPPORTUNITY ? Number(deal.OPPORTUNITY) : undefined,
          currencyId: deal.CURRENCY_ID,
          categoryId: deal.CATEGORY_ID,
          sourceId: deal.SOURCE_ID,
          comments: deal.COMMENTS,
        }))
      );

      if (!data.next || data.result.length < limit) break;
      start += limit;
    }

    return allDeals;
  } catch (error) {
    console.error("Failed to fetch orders from Bitrix:", error);
    return mockOrders;
  }
}
