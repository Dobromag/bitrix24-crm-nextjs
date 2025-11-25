// src/features/profile/server/actions.ts (updated)
"use server";
import db from "@/lib/db";
import { passwordSchema } from "@/lib/validation/zodSchemas"; // Only schema for validation
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import path from "path";
import type { UpdateUserInput, User, UserData } from "../types"; // All from feature types
// Проверка JWT
const verifyToken = async (): Promise<{ id: number; email: string }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!process.env.JWT_SECRET || !token) {
    throw new Error("Неавторизован");
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return payload as { id: number; email: string };
};
// Получение данных пользователя
export async function getUser(): Promise<UserData> {
  const decoded = await verifyToken();
  const user = db
    .prepare(
      "SELECT id, name, email, phone, address, avatar, bitrix_contact_id FROM users WHERE id = ?"
    )
    .get(decoded.id) as User | undefined;
  if (!user) {
    throw new Error("Пользователь не найден");
  }
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? null,
    address: user.address ?? null,
    avatar: user.avatar ?? null,
    bitrix_contact_id: user.bitrix_contact_id ?? null,
  };
}
// Обновление данных пользователя
export async function updateUser(data: Partial<UpdateUserInput>) {
  const decoded = await verifyToken();
  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(decoded.id) as User | undefined;
  if (!user) {
    throw new Error("Пользователь не найден");
  }
  const updateFields: string[] = [];
  const updateValues: (string | null)[] = [];
  const normalize = (val: string | null | undefined): string | null => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? null : trimmed;
    }
    return val ?? null;
  };
  const profileFields: Array<keyof Pick<User, "name" | "phone" | "address">> = [
    "name",
    "phone",
    "address",
  ];
  const profileData = {
    name: data.name,
    phone: data.phone,
    address: data.address,
  };
  for (const field of profileFields) {
    if (field in profileData) {
      const newValue = normalize(profileData[field]);
      const oldValue = normalize(user[field]);
      if (newValue !== oldValue) {
        updateFields.push(`${field} = ?`);
        updateValues.push(newValue);
      }
    }
  }
  // Обработка пароля
  if ("newPassword" in data && data.newPassword) {
    const passwordData = passwordSchema.safeParse(data);
    if (!passwordData.success) {
      throw new Error(passwordData.error.issues[0].message);
    }
    const prevHashes: string[] = user.previous_password_hashes
      ? JSON.parse(user.previous_password_hashes)
      : [];
    const matchesCurrent = await bcrypt.compare(
      data.newPassword,
      user.password
    );
    const matchesPrev = await Promise.all(
      prevHashes.map((hash) => bcrypt.compare(data.newPassword!, hash))
    ).then((results) => results.includes(true));
    if (matchesCurrent || matchesPrev)
      throw new Error("Нельзя использовать старый пароль");
    const hashedNew = await bcrypt.hash(data.newPassword, 10);
    prevHashes.push(user.password); // сохраняем текущий пароль
    updateFields.push("password = ?", "previous_password_hashes = ?");
    updateValues.push(hashedNew, JSON.stringify(prevHashes));
  }
  if ("avatar" in data) {
    const incoming = data.avatar;
    const current = user.avatar;
    let normalized: string | null = null;
    if (typeof incoming === "string") {
      normalized = incoming.trim() === "" ? null : incoming;
    } else if (incoming === null) {
      normalized = null;
    } else {
      normalized = null;
    }
    const avatarChanged = normalized !== current;
    if (avatarChanged) {
      updateFields.push("avatar = ?");
      updateValues.push(normalized);
      if (current && (normalized === null || normalized !== current)) {
        const oldFilePath = path.join(process.cwd(), "public", current);
        await fs
          .unlink(oldFilePath)
          .catch((err) =>
            console.warn("Ошибка удаления старого аватара:", err)
          );
      }
    }
  }
  if (updateFields.length === 0) {
    return { updated: true };
  }
  // Обновляем БД
  updateValues.push(decoded.id.toString());
  db.prepare(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`).run(
    ...updateValues
  );
  // Обновление в Bitrix
  if (user.bitrix_contact_id && profileFields.some((f) => f in data)) {
    const webhook =
      process.env.BITRIX_WEBHOOK_URL?.trim()?.replace(/\/+$/, "") + "/";
    if (webhook) {
      const payload = {
        id: user.bitrix_contact_id,
        fields: {
          NAME: data.name ?? user.name,
          EMAIL: [{ VALUE: user.email, VALUE_TYPE: "WORK" }],
          PHONE: data.phone
            ? [{ VALUE: data.phone, VALUE_TYPE: "WORK" }]
            : undefined,
          ADDRESS: data.address ?? undefined,
        },
      };
      await fetch(`${webhook}crm.contact.update.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn("Bitrix update error:", err));
    }
  }
  revalidatePath("/profile"); // Инвалидация кэша
  return { updated: true };
}
