const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL?.trim();

interface RepeatParams {
  dealId: string;
  contactId: string;
}

interface BitrixDealDetails {
  result: {
    TITLE: string;
    OPPORTUNITY?: string;
    CURRENCY_ID?: string;
    CATEGORY_ID?: string;
    SOURCE_ID?: string;
    COMMENTS?: string;
    // Добавь другие, если нужно (UF_* etc.)
  };
}

interface BitrixAddResponse {
  result: string;
}

export async function repeatOrder({
  dealId,
  contactId,
}: RepeatParams): Promise<string> {
  if (!BITRIX_WEBHOOK_URL) {
    const newId = `mock-new-${Date.now()}`;
    console.info("Mock repeat order for deal", dealId, "→ new", newId);
    return newId;
  }

  const webhook = BITRIX_WEBHOOK_URL.replace(/\/+$/, "") + "/";

  try {
    // Получаем данные старой сделки
    const getRes = await fetch(`${webhook}crm.deal.get.json?ID=${dealId}`);
    if (!getRes.ok) throw new Error(`Bitrix get error: ${getRes.status}`);

    const getData = (await getRes.json()) as BitrixDealDetails;
    const oldDeal = getData.result;

    // Создаём новую, копируя поля
    const newPayload = {
      fields: {
        TITLE: oldDeal.TITLE || `Сделка ${dealId}`, // Оригинальный TITLE
        CONTACT_ID: contactId,
        STAGE_ID: "NEW", // Новый статус
        ...(oldDeal.OPPORTUNITY && {
          OPPORTUNITY: Number(oldDeal.OPPORTUNITY),
        }),
        ...(oldDeal.CURRENCY_ID && { CURRENCY_ID: oldDeal.CURRENCY_ID }),
        ...(oldDeal.CATEGORY_ID && { CATEGORY_ID: oldDeal.CATEGORY_ID }),
        ...(oldDeal.SOURCE_ID && { SOURCE_ID: oldDeal.SOURCE_ID }),
        ...(oldDeal.COMMENTS && { COMMENTS: oldDeal.COMMENTS }),
        // Добавь UF_* или другие
      },
    };

    const addRes = await fetch(`${webhook}crm.deal.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPayload),
    });

    if (!addRes.ok) throw new Error(`Bitrix add error: ${addRes.status}`);

    const addData = (await addRes.json()) as BitrixAddResponse;
    return String(addData.result);
  } catch (error) {
    console.error("Repeat order failed:", error);
    throw error;
  }
}
