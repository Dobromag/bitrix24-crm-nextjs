import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

type ReqBody = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
};

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export async function POST(request: Request) {
  try {
    // Чтение тела запроса
    const text = await request.text();
    let body: ReqBody;
    try {
      body = text ? (JSON.parse(text) as ReqBody) : {};
    } catch {
      return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
    }

    const rawEmail = body.email;
    const rawPassword = body.password;
    const rawName = body.name;

    const fieldErrors: Record<string, string> = {};
    let email = "";
    let password = "";
    let name = "";

    if (
      !isString(rawEmail) ||
      !EMAIL_REGEX.test(rawEmail.trim().toLowerCase())
    ) {
      fieldErrors.email = "Неверный email";
    } else {
      email = rawEmail.trim().toLowerCase();
    }

    if (!isString(rawPassword) || !PASSWORD_REGEX.test(rawPassword)) {
      fieldErrors.password = "Пароль должен содержать минимум 6 символов...";
    } else {
      password = rawPassword;
    }

    if (!isString(rawName) || rawName.trim().length < 3) {
      fieldErrors.login = "Имя должен содержать минимум 3 символа";
    } else {
      name = rawName.trim();
    }

    // Если базовая валидация провалилась — не идем в БД
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ fieldErrors }, { status: 400 });
    }

    // Проверка уникальности email
    const existingEmail = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (existingEmail) {
      fieldErrors.email = "Это электронное письмо уже занято!";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json({ fieldErrors }, { status: 409 });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Вставка пользователя с обработкой ошибок
    let userId: number;
    try {
      const insert = db.prepare(
        "INSERT INTO users (email, name, password) VALUES (?, ?, ?)"
      );
      const info = insert.run(email, name, hashedPassword);
      userId = Number(info.lastInsertRowid);
    } catch (err: unknown) {
      if (err instanceof Error && /unique/i.test(err.message)) {
        return NextResponse.json(
          { error: "Пользователь с таким email или логином уже существует" },
          { status: 409 }
        );
      }
      console.error("DB insert error:", err);
      throw err;
    }

    // Интеграция с Bitrix (с fallback в очередь)
    let bitrixContactId: string | null = null;
    const rawWebhook = process.env.BITRIX_WEBHOOK_URL?.trim();
    if (rawWebhook) {
      const webhook = rawWebhook.replace(/\/+$/, "") + "/";
      const payload = {
        fields: {
          NAME: name,
          EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
        },
      };
      try {
        const res = await fetch(`${webhook}crm.contact.add.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          const possibleId =
            typeof data.result === "number" || typeof data.result === "string"
              ? String(data.result)
              : data.result?.ID || data.result?.id;
          if (possibleId) {
            bitrixContactId = possibleId;
            // Сохраняем Bitrix ID в базе
            try {
              db.prepare(
                "UPDATE users SET bitrix_contact_id = ? WHERE id = ?"
              ).run(bitrixContactId, userId);
            } catch (updateErr) {
              console.warn("Не удалось обновить bitrix_contact_id:", updateErr);
            }
          }
        } else {
          const errorText = await res.text().catch(() => "");
          throw new Error(`Bitrix error: ${res.status} - ${errorText}`);
        }
      } catch (err: unknown) {
        console.warn("Ошибка интеграции с Bitrix — добавляем в очередь:", err);
        // Добавляем в pending_syncs
        const pendingPayload = JSON.stringify({ name, email });
        db.prepare(
          `INSERT INTO pending_syncs (user_id, action, payload) VALUES (?, 'create_contact', ?)`
        ).run(userId, pendingPayload);
      }
    }

    return NextResponse.json(
      { ok: true, id: userId, bitrixContactId },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Ошибка регистрации:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
