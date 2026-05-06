import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { clearAuthCookie } from "@/lib/auth";

export const POST = apiHandler(async () => {
  const response = NextResponse.json(
    {
      data: { success: true },
      error: null,
    },
    { status: 200 },
  );

  clearAuthCookie(response);
  return response;
});
