import db from "@/lib/db";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

// POST — загрузка аватара
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar");
    const userIdRaw = formData.get("userId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Avatar file required" },
        { status: 400 }
      );
    }

    const userId = typeof userIdRaw === "string" ? Number(userIdRaw) : null;
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // Сохраняем в public/avatars
    const avatarsDir = path.join(process.cwd(), "public", "avatars");
    fs.mkdirSync(avatarsDir, { recursive: true });

    const extension = file.name.split(".").pop() || "jpg";
    const filename = `user_${userId}_${Date.now()}.${extension}`;
    const filePath = path.join(avatarsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // URL теперь статический
    const publicUrl = `/avatars/${filename}`;

    // Обновляем БД
    db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(
      publicUrl,
      userId
    );

    return NextResponse.json({ avatarUrl: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
