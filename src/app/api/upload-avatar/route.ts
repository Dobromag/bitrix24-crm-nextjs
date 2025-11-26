import db from "@/lib/db";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

// =======================================================================================
// GET — отдача аватара
// /api/upload-avatar?filename=user_1_173883838.jpg
// =======================================================================================
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
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Avatar GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================================================================================
// POST — загрузка аватара
// =======================================================================================
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

    if (typeof userIdRaw !== "string" || isNaN(Number(userIdRaw))) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const userId = Number(userIdRaw);

    const avatarsDir = process.env.AVATARS_PATH || "/data/avatars";
    fs.mkdirSync(avatarsDir, { recursive: true });

    const extension = file.name.split(".").pop() || "jpg";
    const filename = `user_${userId}_${Date.now()}.${extension}`;
    const filePath = path.join(avatarsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/api/upload-avatar?filename=${filename}`;

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
