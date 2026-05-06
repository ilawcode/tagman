import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { apiHandler } from "@/lib/apiHandler";
import { buildCsv } from "@/lib/csvExport";
import { connectDB } from "@/lib/db";
import { Trainer } from "@/models/Trainer";

type ExportTrainerAggregation = {
  firstName: string;
  lastName: string;
  employmentType: "internal" | "external";
  consultingFirm?: string;
  averageScore: number | null;
  skills: Array<{
    score: number;
    name?: string;
  }>;
};

export const GET = apiHandler(async (req: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const employmentType = searchParams.get("employmentType")?.trim() ?? "";
  const consultingFirm = searchParams.get("consultingFirm")?.trim() ?? "";
  const skillId = searchParams.get("skillId")?.trim() ?? "";
  const minScoreRaw = searchParams.get("minScore")?.trim() ?? "";
  const minScore = minScoreRaw ? Number(minScoreRaw) : null;

  const match: Record<string, unknown> = { isActive: true };

  if (q.length > 0) {
    const regex = new RegExp(q, "i");
    match.$or = [{ firstName: regex }, { lastName: regex }];
  }

  if (employmentType === "internal" || employmentType === "external") {
    match.employmentType = employmentType;
  }

  if (consultingFirm.length > 0) {
    match.consultingFirm = new RegExp(consultingFirm, "i");
  }

  const scoreFilterActive = typeof minScore === "number" && !Number.isNaN(minScore);
  const validSkillId = Types.ObjectId.isValid(skillId);

  if (validSkillId || scoreFilterActive) {
    const elemMatch: Record<string, unknown> = {};

    if (validSkillId) {
      elemMatch.skill = new Types.ObjectId(skillId);
    }

    if (scoreFilterActive) {
      elemMatch.score = { $gte: minScore };
    }

    match.skills = { $elemMatch: elemMatch };
  }

  const trainers = await Trainer.aggregate<ExportTrainerAggregation>([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "evaluations",
        localField: "_id",
        foreignField: "trainer",
        as: "evaluations",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "skills.skill",
        foreignField: "_id",
        as: "skillDocs",
      },
    },
    {
      $addFields: {
        averageScore: {
          $cond: [
            { $gt: [{ $size: "$evaluations" }, 0] },
            { $round: [{ $avg: "$evaluations.score" }, 1] },
            null,
          ],
        },
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        employmentType: 1,
        consultingFirm: 1,
        averageScore: 1,
        skills: {
          $map: {
            input: "$skills",
            as: "trainerSkill",
            in: {
              score: "$$trainerSkill.score",
              name: {
                $let: {
                  vars: {
                    matchedSkill: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$skillDocs",
                            as: "skillDoc",
                            cond: { $eq: ["$$skillDoc._id", "$$trainerSkill.skill"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$matchedSkill.name",
                },
              },
            },
          },
        },
      },
    },
    {
      $sort: {
        averageScore: -1,
        firstName: 1,
        lastName: 1,
      },
    },
  ]);

  const headers = [
    "Ad",
    "Soyad",
    "Kurum Durumu",
    "Danışmanlık Firmasi",
    "Ortalama Puan",
    "Skill Listesi",
  ];

  const rows = trainers.map((trainer) => [
    trainer.firstName,
    trainer.lastName,
    trainer.employmentType === "internal" ? "Kurum içi" : "Kurum dışı",
    trainer.consultingFirm ?? "",
    trainer.averageScore ?? "",
    trainer.skills.map((skill) => `${skill.name ?? "Isimsiz"}:${skill.score}`).join(" | "),
  ]);

  const csv = buildCsv(headers, rows, true);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=trainer-search-export.csv",
    },
  });
});
