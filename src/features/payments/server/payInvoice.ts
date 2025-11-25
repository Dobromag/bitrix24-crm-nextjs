// src/features/payments/server/payInvoice.ts
export async function payInvoice(invoiceId: string): Promise<void> {
  const webhook = process.env.BITRIX_WEBHOOK_URL;
  if (!webhook) {
    await new Promise((r) => setTimeout(r, 1200));
    console.info("Mock payment for invoice", invoiceId);
    return;
  }

  const res = await fetch(`${webhook}/crm.invoice.update.json`, {
    method: "POST",
    body: JSON.stringify({
      ID: invoiceId,
      FIELDS: { STATUS_ID: "P" },
    }),
  });

  if (!res.ok) throw new Error("Payment failed");
}
