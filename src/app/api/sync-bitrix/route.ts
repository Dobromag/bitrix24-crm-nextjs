import db from "@/lib/db";
import { NextResponse } from "next/server";

interface PendingSync {
  id: number;
  user_id: number;
  action: string;
  payload: string;
  attempts: number;
}

export async function POST() {
  const rawWebhook = process.env.BITRIX_WEBHOOK_URL?.trim();
  if (!rawWebhook) {
    return NextResponse.json(
      { error: "Bitrix webhook not set" },
      { status: 400 }
    );
  }
  const webhook = rawWebhook.replace(/\/+$/, "") + "/";

  try {
    // Берём все pending с attempts < 5
    const pendings = db
      .prepare(
        `SELECT * FROM pending_syncs WHERE attempts < 5 ORDER BY created_at ASC`
      )
      .all() as PendingSync[];

    let syncedCount = 0;
    for (const pending of pendings) {
      if (pending.action !== "create_contact") continue;

      const data = JSON.parse(pending.payload);
      const bitrixPayload = {
        fields: {
          NAME: data.name,
          EMAIL: [{ VALUE: data.email, VALUE_TYPE: "WORK" }],
        },
      };

      try {
        const res = await fetch(`${webhook}crm.contact.add.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bitrixPayload),
        });

        if (!res.ok) {
          throw new Error(`Bitrix error: ${res.status}`);
        }

        const responseData = await res.json();
        const bitrixId = String(responseData.result); // Упрощённо, адаптируй под реальный ответ

        // Обновляем user
        db.prepare("UPDATE users SET bitrix_contact_id = ? WHERE id = ?").run(
          bitrixId,
          pending.user_id
        );

        // Удаляем из pending
        db.prepare("DELETE FROM pending_syncs WHERE id = ?").run(pending.id);

        syncedCount++;
      } catch (err) {
        // Увеличиваем attempts
        db.prepare(
          "UPDATE pending_syncs SET attempts = attempts + 1, last_attempt = CURRENT_TIMESTAMP WHERE id = ?"
        ).run(pending.id);
        console.warn(`Sync failed for user ${pending.user_id}:`, err);
      }
    }

    return NextResponse.json({ ok: true, synced: syncedCount });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
