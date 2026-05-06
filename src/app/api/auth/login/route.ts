import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { setAuthCookie, signToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { User } from "@/models/User";

export const POST = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Geçersiz form verisi",
        },
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const { password } = parsed.data;

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "E-posta veya sifre hatali",
        },
      },
      { status: 401 },
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "E-posta veya sifre hatali",
        },
      },
      { status: 401 },
    );
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });
  const response = NextResponse.json(
    {
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
        },
      },
      error: null,
    },
    { status: 200 },
  );

  setAuthCookie(response, token);
  return response;
});
