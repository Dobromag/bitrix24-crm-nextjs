import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/profile",
  "/orders",
  "/payments",
  "/stream",
];
const authPaths = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const url = request.nextUrl.pathname;

  // Проверка для auth-страниц: если токен валиден, редирект на dashboard
  if (authPaths.some((path) => url.startsWith(path))) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        const response = NextResponse.next();
        response.cookies.delete("authToken");
        return response;
      }
    }
    return NextResponse.next();
  }

  // Проверка для protected-страниц: если нет валидного токена, редирект на login
  if (protectedPaths.some((path) => url.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("authToken");
      return response;
    }
  }

  // Для других путей — пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/payments/:path*",
    "/stream/:path*",
  ],
};
