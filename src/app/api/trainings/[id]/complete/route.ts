import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { trainingCompleteSchema } from "@/lib/schemas/training.schema";
import { Evaluation } from "@/models/Evaluation";
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
    const parsed = trainingCompleteSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message ?? "Puan zorunludur",
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
            message: "Sadece planlı eğitimler tamamlanabilir",
          },
        },
        { status: 409 },
      );
    }

    const trainerIds = [training.primaryTrainer, ...(training.coTrainers ?? [])]
      .filter(Boolean)
      .map((id) => id!.toString());

    const uniqueTrainerIds = Array.from(new Set(trainerIds));

    if (uniqueTrainerIds.length === 0) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "NO_TRAINER",
            message: "Tamamlama icin en az bir atanmis eğitmen olmalidir",
          },
        },
        { status: 400 },
      );
    }

    await Evaluation.insertMany(
      uniqueTrainerIds.map((trainerId) => ({
        trainer: new Types.ObjectId(trainerId),
        training: new Types.ObjectId(trainingId),
        score: parsed.data.score,
      })),
      { ordered: false },
    );

    const updated = await Training.findByIdAndUpdate(
      trainingId,
      {
        status: "completed",
        completionScore: parsed.data.score,
      },
      { new: true },
    ).lean();

    return NextResponse.json({
      data: {
        training: updated,
        evaluationCount: uniqueTrainerIds.length,
        affectedTrainerIds: uniqueTrainerIds,
      },
      error: null,
    });
  },
);
