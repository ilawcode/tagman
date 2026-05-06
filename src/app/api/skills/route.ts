import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { createSkillSchema } from "@/lib/schemas/skill.schema";
import { Skill } from "@/models/Skill";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("activeOnly") === "true";

  const filter = activeOnly ? { isActive: true } : {};
  const skills = await Skill.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ data: { skills }, error: null });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = createSkillSchema.safeParse(payload);

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

  const name = parsed.data.name.trim();
  const nameLower = name.toLowerCase();

  await connectDB();

  const duplicate = await Skill.findOne({ nameLower, isActive: true }).lean();
  if (duplicate) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "SKILL_ALREADY_EXISTS",
          message: "Bu skill adi zaten mevcut",
        },
      },
      { status: 409 },
    );
  }

  const skill = await Skill.create({ name, nameLower, isActive: true });

  return NextResponse.json(
    {
      data: {
        skill,
      },
      error: null,
    },
    { status: 201 },
  );
});
