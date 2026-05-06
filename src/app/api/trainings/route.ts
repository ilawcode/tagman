import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { trainingAssignSchema, trainingCreateSchema } from "@/lib/schemas/training.schema";
import { Trainer } from "@/models/Trainer";
import { Training } from "@/models/Training";

export const GET = apiHandler(async () => {
  await connectDB();

  const trainings = await Training.find({})
    .populate({ path: "primaryTrainer", select: "firstName lastName" })
    .populate({ path: "coTrainers", select: "firstName lastName" })
    .sort({ date: -1 })
    .lean();

  return NextResponse.json({ data: { trainings }, error: null });
});

export const POST = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = trainingCreateSchema.safeParse(payload);

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

  const token = await getTokenFromRequest();
  const auth = token ? verifyToken(token) : null;

  if (!auth) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Yetkisiz erişim",
        },
      },
      { status: 401 },
    );
  }

  const training = await Training.create({
    subject: parsed.data.subject,
    date: new Date(parsed.data.date),
    durationMinutes: parsed.data.durationMinutes,
    location: parsed.data.location,
    coordinator: auth.userId,
    notes: parsed.data.notes?.trim() || undefined,
    status: "planned",
  });

  return NextResponse.json(
    {
      data: {
        training,
      },
      error: null,
    },
    { status: 201 },
  );
});

function mapConflictPayload(
  conflicts: Array<{
    _id: { toString(): string };
    subject: string;
    date: Date;
    primaryTrainer?: { toString(): string } | null;
    coTrainers?: Array<{ toString(): string }>;
  }>,
  selectedTrainerIds: Set<string>,
) {
  return conflicts.map((training) => {
    const trainerIds = [training.primaryTrainer, ...(training.coTrainers ?? [])]
      .filter(Boolean)
      .map((id) => id!.toString());

    return {
      trainingId: training._id.toString(),
      subject: training.subject,
      date: training.date,
      conflictingTrainerIds: trainerIds.filter((id) => selectedTrainerIds.has(id)),
    };
  });
}

export const PUT = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = trainingAssignSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Geçersiz atama verisi",
        },
      },
      { status: 400 },
    );
  }

  await connectDB();

  const training = await Training.findById(parsed.data.trainingId).lean();
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

  const selectedTrainerIds = new Set([parsed.data.primaryTrainerId, ...parsed.data.coTrainerIds]);
  const selectedTrainerObjectIds = Array.from(selectedTrainerIds).map((id) => new Types.ObjectId(id));

  const activeTrainerCount = await Trainer.countDocuments({
    _id: { $in: Array.from(selectedTrainerIds) },
    isActive: true,
  });

  if (activeTrainerCount !== selectedTrainerIds.size) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_TRAINER",
          message: "Yalnizca aktif eğitmenler atanabilir",
        },
      },
      { status: 400 },
    );
  }

  const conflicts = await Training.aggregate<{
    _id: { toString(): string };
    subject: string;
    date: Date;
    primaryTrainer?: { toString(): string } | null;
    coTrainers?: Array<{ toString(): string }>;
  }>([
    {
      $match: {
        _id: { $ne: new Types.ObjectId(parsed.data.trainingId) },
        date: training.date,
        status: "planned",
        $or: [
          { primaryTrainer: { $in: selectedTrainerObjectIds } },
          { coTrainers: { $in: selectedTrainerObjectIds } },
        ],
      },
    },
    {
      $project: {
        subject: 1,
        date: 1,
        primaryTrainer: 1,
        coTrainers: 1,
      },
    },
  ]);

  return NextResponse.json({
    data: {
      hasConflicts: conflicts.length > 0,
      conflicts: mapConflictPayload(conflicts, selectedTrainerIds),
    },
    error: null,
  });
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const payload = await req.json();
  const parsed = trainingAssignSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Geçersiz atama verisi",
        },
      },
      { status: 400 },
    );
  }

  await connectDB();

  const training = await Training.findById(parsed.data.trainingId).lean();
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

  const selectedTrainerIds = new Set([parsed.data.primaryTrainerId, ...parsed.data.coTrainerIds]);
  const selectedTrainerObjectIds = Array.from(selectedTrainerIds).map((id) => new Types.ObjectId(id));
  const conflicts = await Training.aggregate<{
    _id: { toString(): string };
    subject: string;
    date: Date;
    primaryTrainer?: { toString(): string } | null;
    coTrainers?: Array<{ toString(): string }>;
  }>([
    {
      $match: {
        _id: { $ne: new Types.ObjectId(parsed.data.trainingId) },
        date: training.date,
        status: "planned",
        $or: [
          { primaryTrainer: { $in: selectedTrainerObjectIds } },
          { coTrainers: { $in: selectedTrainerObjectIds } },
        ],
      },
    },
    {
      $project: {
        subject: 1,
        date: 1,
        primaryTrainer: 1,
        coTrainers: 1,
      },
    },
  ]);

  if (conflicts.length > 0 && !parsed.data.ignoreConflicts) {
    return NextResponse.json(
      {
        data: {
          hasConflicts: true,
          conflicts: mapConflictPayload(conflicts, selectedTrainerIds),
        },
        error: {
          code: "CONFLICT_WARNING",
          message: "Seçilen eğitmenler icin çakışma bulundu",
        },
      },
      { status: 409 },
    );
  }

  const updated = await Training.findByIdAndUpdate(
    parsed.data.trainingId,
    {
      primaryTrainer: new Types.ObjectId(parsed.data.primaryTrainerId),
      coTrainers: parsed.data.coTrainerIds.map((id) => new Types.ObjectId(id)),
    },
    { new: true },
  )
    .populate({ path: "primaryTrainer", select: "firstName lastName" })
    .populate({ path: "coTrainers", select: "firstName lastName" })
    .lean();

  return NextResponse.json({ data: { training: updated }, error: null });
});
