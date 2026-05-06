import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { updateSkillSchema } from "@/lib/schemas/skill.schema";
import { Skill } from "@/models/Skill";

export const PATCH = apiHandler(
  async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const params = await context?.params;
    const skillId = params?.id;

    if (!skillId) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Skill id zorunludur",
          },
        },
        { status: 400 },
      );
    }

    const payload = await req.json();
    const parsed = updateSkillSchema.safeParse(payload);

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

    await connectDB();

    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { isActive: parsed.data.isActive },
      { new: true },
    ).lean();

    if (!skill) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Skill bulunamadı",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { skill }, error: null });
  },
);
