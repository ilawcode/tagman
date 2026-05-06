import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { trainerCreateSchema } from "@/lib/schemas/trainer.schema";
import { Trainer } from "@/models/Trainer";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("activeOnly") !== "false";

  const filter = activeOnly ? { isActive: true } : {};
  const trainers = await Trainer.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ data: { trainers }, error: null });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = trainerCreateSchema.safeParse(payload);

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

  const trainer = await Trainer.create({
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    employmentType: parsed.data.employmentType,
    consultingFirm: parsed.data.consultingFirm?.trim() || undefined,
    biography: parsed.data.biography,
    isActive: true,
  });

  return NextResponse.json(
    {
      data: {
        trainer,
      },
      error: null,
    },
    { status: 201 },
  );
});
