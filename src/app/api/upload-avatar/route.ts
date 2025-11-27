import db from "@/lib/db";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
export const runtime = "nodejs";

// GET — отдача аватара (динамически из volume)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }
    const avatarsDir = process.env.AVATARS_PATH || "/data/avatars";
    const filePath = path.join(avatarsDir, filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const file = fs.readFileSync(filePath);
    const ext = filename.split(".").pop() ?? "jpg";
    const contentType = ext === "png" ? "image/png" : "image/jpeg"; // Добавьте другие, если нужно
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Avatar GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST — загрузка (в volume)
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
    const avatarsDir = process.env.AVATARS_PATH || "/data/avatars";
    fs.mkdirSync(avatarsDir, { recursive: true });
    fs.chmodSync(avatarsDir, 0o777); // Для permissions
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `user_${userId}_${Date.now()}.${extension}`;
    const filePath = path.join(avatarsDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    fs.chmodSync(filePath, 0o666); // Для read
    const publicUrl = `/api/upload-avatar?filename=${filename}&v=${Date.now()}`;
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
