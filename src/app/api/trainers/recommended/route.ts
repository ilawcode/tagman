import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { Evaluation } from "@/models/Evaluation";
import { Skill } from "@/models/Skill";
import { Trainer } from "@/models/Trainer";
import { Training } from "@/models/Training";

type RecommendedTrainer = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  matchedSkills: string[];
  averageScore: number | null;
  bestSkillScore: number | null;
};

function extractKeywords(subject: string) {
  const words = subject
    .toLowerCase()
    .split(/[^a-z0-9çğıöşü]+/i)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2);

  return Array.from(new Set(words)).slice(0, 8);
}

export const GET = apiHandler(async (req: NextRequest) => {
  const trainingId = req.nextUrl.searchParams.get("trainingId")?.trim();

  if (!trainingId || !Types.ObjectId.isValid(trainingId)) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Gecerli bir trainingId gereklidir",
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

  const keywords = extractKeywords(training.subject);
  const keywordRegex = keywords.length > 0 ? keywords.join("|") : "";

  const startedAt = Date.now();
  let matchedSkillIds: Types.ObjectId[] = [];
  let matchedSkillNames: string[] = [];

  if (keywords.length > 0) {
    const matchedSkillDocs = await Skill.find({
      isActive: true,
      nameLower: {
        $regex: keywordRegex,
        $options: "i",
      },
    })
      .select("_id name")
      .lean();

    matchedSkillNames = matchedSkillDocs
      .map((skill) => (typeof (skill as { name?: string }).name === "string" ? (skill as { name: string }).name : ""))
      .filter((name) => name.length > 0);
    matchedSkillIds = matchedSkillDocs.map((skill) => new Types.ObjectId(skill._id));
    if (matchedSkillIds.length === 0) {
      return NextResponse.json({
        data: {
          recommended: [],
          queryDurationMs: Date.now() - startedAt,
          keywordCount: keywords.length,
        },
        error: null,
      });
    }
  }

  const recommended = await Trainer.aggregate<RecommendedTrainer>([
    {
      $match: {
        isActive: true,
        ...(matchedSkillIds.length > 0
          ? {
              "skills.skill": {
                $in: matchedSkillIds,
              },
            }
          : {}),
      },
    },
    {
      $addFields: {
        matchedSkills: matchedSkillNames,
      },
    },
    {
      $lookup: {
        from: "trainings",
        let: { trainerId: "$_id" },
        pipeline: [
          {
            $match: {
              _id: { $ne: new Types.ObjectId(trainingId) },
              status: "planned",
              date: training.date,
              $expr: {
                $or: [
                  { $eq: ["$primaryTrainer", "$$trainerId"] },
                  { $in: ["$$trainerId", { $ifNull: ["$coTrainers", []] }] },
                ],
              },
            },
          },
          {
            $project: { _id: 1 },
          },
        ],
        as: "busyTrainings",
      },
    },
    {
      $match: {
        $expr: {
          $eq: [{ $size: "$busyTrainings" }, 0],
        },
      },
    },
    {
      $lookup: {
        from: Evaluation.collection.name,
        localField: "_id",
        foreignField: "trainer",
        as: "evaluationDocs",
      },
    },
    {
      $addFields: {
        averageScore: {
          $cond: [
            { $gt: [{ $size: "$evaluationDocs" }, 0] },
            { $round: [{ $avg: "$evaluationDocs.score" }, 1] },
            null,
          ],
        },
        bestSkillScore: {
          $cond: [
            { $gt: [{ $size: "$skills" }, 0] },
            { $max: "$skills.score" },
            null,
          ],
        },
      },
    },
    {
      $sort: {
        averageScore: -1,
        bestSkillScore: -1,
        lastName: 1,
        firstName: 1,
      },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        matchedSkills: 1,
        averageScore: 1,
        bestSkillScore: 1,
      },
    },
  ]);

  const durationMs = Date.now() - startedAt;

  return NextResponse.json({
    data: {
      recommended: recommended.map((trainer) => ({
        _id: trainer._id.toString(),
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        matchedSkills: trainer.matchedSkills,
        averageScore: trainer.averageScore,
        bestSkillScore: trainer.bestSkillScore,
      })),
      queryDurationMs: durationMs,
      keywordCount: keywords.length,
    },
    error: null,
  });
});