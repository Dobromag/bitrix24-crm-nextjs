import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Выход успешен" },
    { status: 200 }
  );
  response.cookies.delete("authToken");
  return response;
}
