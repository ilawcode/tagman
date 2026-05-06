import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { signToken, setAuthCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { User } from "@/models/User";

export const POST = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = registerSchema.safeParse(payload);

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

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "Bu e-posta adresi zaten kayitli",
        },
      },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
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
    { status: 201 },
  );

  setAuthCookie(response, token);
  return response;
});
