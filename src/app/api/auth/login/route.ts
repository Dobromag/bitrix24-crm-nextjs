import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  bitrix_contact_id: string | null;
  created_at: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      );
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as User | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Генерация JWT с помощью jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    console.log("Generated token:", token); // Отладка: проверяем токен

    // Устанавливаем cookie с токеном
    const response = NextResponse.json(
      { message: "Успешный вход" },
      { status: 200 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true, // JS не может читать
      secure: false, // Отключаем secure для localhost (в продакшене включить)
      sameSite: "strict", // Защита от CSRF
      maxAge: 3600, // 1 час
      path: "/", // Доступно для всего сайта
    });

    console.log("Cookie set: authToken"); // Отладка: подтверждаем установку cookie

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
