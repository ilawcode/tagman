import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { trainingCancelSchema } from "@/lib/schemas/training.schema";
import { Training } from "@/models/Training";

export const POST = apiHandler(
  async (req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const params = await context?.params;
    const trainingId = params?.id;

    if (!trainingId) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Eğitim id zorunludur",
          },
        },
        { status: 400 },
      );
    }

    const payload = await req.json();
    const parsed = trainingCancelSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "İptal notu zorunludur",
          },
        },
        { status: 400 },
      );
    }

    await connectDB();

    const training = await Training.findById(trainingId).lean();
    if (!training) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "NOT_FOUND",
            message: "Eğitim bulunamadı",
          },
        },
        { status: 404 },
      );
    }

    if (training.status !== "planned") {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "INVALID_STATE",
            message: "Sadece planlı eğitimler iptal edilebilir",
          },
        },
        { status: 409 },
      );
    }

    const updated = await Training.findByIdAndUpdate(
      trainingId,
      {
        status: "cancelled",
        cancelNote: parsed.data.cancelNote,
      },
      { new: true },
    ).lean();

    return NextResponse.json({ data: { training: updated }, error: null });
  },
);
