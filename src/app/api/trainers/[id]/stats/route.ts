import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { Evaluation } from "@/models/Evaluation";

export const GET = apiHandler(
  async (_req: NextRequest, context?: { params: Promise<Record<string, string>> }) => {
    const params = await context?.params;
    const trainerId = params?.id;

    if (!trainerId || !Types.ObjectId.isValid(trainerId)) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "BAD_REQUEST",
            message: "Geçersiz trainer id",
          },
        },
        { status: 400 },
      );
    }

    await connectDB();

    const trainerObjectId = new Types.ObjectId(trainerId);

    const avgResult = await Evaluation.aggregate<{ averageScore: number }>([
      {
        $match: {
          trainer: trainerObjectId,
        },
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" },
        },
      },
      {
        $project: {
          _id: 0,
          averageScore: { $round: ["$averageScore", 1] },
        },
      },
    ]);

    const trainingCountByYear = await Evaluation.aggregate<{ year: number; count: number }>([
      {
        $match: {
          trainer: trainerObjectId,
        },
      },
      {
        $lookup: {
          from: "trainings",
          localField: "training",
          foreignField: "_id",
          as: "training",
        },
      },
      {
        $unwind: "$training",
      },
      {
        $group: {
          _id: { $year: "$training.date" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          year: 1,
        },
      },
    ]);

    return NextResponse.json({
      data: {
        averageScore: avgResult[0]?.averageScore ?? null,
        trainingCountByYear,
      },
      error: null,
    });
  },
);
