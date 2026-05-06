import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { trainerSkillUpdateSchema } from "@/lib/schemas/trainer.schema";
import { Skill } from "@/models/Skill";
import { Trainer } from "@/models/Trainer";

export const GET = apiHandler(
  async (_req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const params = await context?.params;
    const trainerId = params?.id;

    if (!trainerId) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Trainer id zorunludur",
          },
        },
        { status: 400 },
      );
    }

    await connectDB();

    const trainer = await Trainer.findById(trainerId)
      .populate({ path: "skills.skill", select: "name isActive" })
      .lean();

    if (!trainer) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Eğitmen bulunamadı",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { trainer }, error: null });
  },
);

export const PUT = apiHandler(
  async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const params = await context?.params;
    const trainerId = params?.id;

    if (!trainerId) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Trainer id zorunludur",
          },
        },
        { status: 400 },
      );
    }

    const payload = await req.json();
    const parsed = trainerSkillUpdateSchema.safeParse(payload);

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

    const skillIds = parsed.data.skills.map((entry) => entry.skillId);
    const uniqueSkillIds = new Set(skillIds);

    if (uniqueSkillIds.size !== skillIds.length) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "DUPLICATE_SKILL",
            message: "Aynı skill birden fazla kez atanamaz",
          },
        },
        { status: 400 },
      );
    }

    await connectDB();

    const activeSkills = await Skill.find({
      _id: { $in: Array.from(uniqueSkillIds) },
      isActive: true,
    })
      .select("_id")
      .lean();

    if (activeSkills.length !== uniqueSkillIds.size) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "INVALID_SKILL",
            message: "Yalnizca aktif skill'ler atanabilir",
          },
        },
        { status: 400 },
      );
    }

    const mappedSkills = parsed.data.skills.map((entry) => ({
      skill: new Types.ObjectId(entry.skillId),
      score: entry.score,
    }));

    const trainer = await Trainer.findByIdAndUpdate(
      trainerId,
      {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        employmentType: parsed.data.employmentType,
        consultingFirm: parsed.data.consultingFirm?.trim() || undefined,
        biography: parsed.data.biography,
        isActive: parsed.data.isActive,
        skills: mappedSkills,
      },
      { new: true },
    )
      .populate({ path: "skills.skill", select: "name isActive" })
      .lean();

    if (!trainer) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Eğitmen bulunamadı",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { trainer }, error: null });
  },
);
