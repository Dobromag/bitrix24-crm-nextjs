"use server";

import db from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  bitrix_contact_id: string | null;
  // Другие поля
}

export async function getUser(): Promise<UserData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) throw new Error("Unauthorized");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    const userId = Number(payload.id);
    if (!userId) throw new Error("Invalid token");

    const user = db
      .prepare(
        `SELECT id, name, email, phone, address, avatar, bitrix_contact_id FROM users WHERE id = ?`
      )
      .get(userId) as UserData;

    if (!user) throw new Error("User not found");

    return user;
  } catch (err) {
    console.error("Get user error:", err);
    throw new Error("Unauthorized");
  }
}
