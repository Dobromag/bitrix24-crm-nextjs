// src/app/api/upload-avatar/route.ts
import fs from "fs/promises";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET!;

async function verifyToken(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  console.log("Token from cookies:", token ? "exists" : "MISSING");
  if (!token) throw new Error("Unauthorized");

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(JWT_SECRET),
    {
      algorithms: ["HS256"],
    }
  );
  return payload as { id: number };
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await verifyToken(req);
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      console.log("ERROR: No file");
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // Валидация
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Only JPG/PNG" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Max 2MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const filename = `user_${id}_${timestamp}.${ext}`;
    const filepath = path.join(
      process.cwd(),
      "public",
      "images",
      "avatars",
      filename
    );
    // Создаём папку, если нет
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);

    const avatarUrl = `/images/avatars/${filename}`;
    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error("=== API ERROR ===", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    } else {
      console.error("Non-Error caught:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
