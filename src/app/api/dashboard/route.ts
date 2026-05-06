import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { apiHandler } from "@/lib/apiHandler";
import { connectDB } from "@/lib/db";
import { Training } from "@/models/Training";

type DashboardTrainingView = {
  _id: string;
  subject: string;
  date: string;
  status: "planned" | "cancelled" | "completed";
};

type TrainingListItem = {
  _id: { toString(): string };
  subject: string;
  date: Date;
  status: "planned" | "cancelled" | "completed";
};

function startOfWeekMonday(reference: Date) {
  const date = new Date(reference);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function mapTraining(training: TrainingListItem): DashboardTrainingView {
  return {
    _id: training._id.toString(),
    subject: training.subject,
    date: training.date.toISOString(),
    status: training.status,
  };
}

export const GET = apiHandler(async (req: NextRequest) => {
  await connectDB();

  const scope = req.nextUrl.searchParams.get("scope") === "mine" ? "mine" : "all";
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

  const scopeFilter: Record<string, unknown> =
    scope === "mine"
      ? {
          coordinator: auth.userId,
        }
      : {};

  const now = new Date();
  const weekStart = startOfWeekMonday(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const next30End = new Date(now);
  next30End.setDate(next30End.getDate() + 30);

  const [weeklyTrainings, upcoming30Days] = await Promise.all([
    Training.find({
      ...scopeFilter,
      date: {
        $gte: weekStart,
        $lt: weekEnd,
      },
    })
      .select("subject date status")
      .sort({ date: 1 })
      .lean(),
    Training.find({
      ...scopeFilter,
      date: {
        $gte: now,
        $lt: next30End,
      },
    })
      .select("subject date status")
      .sort({ date: 1 })
      .lean(),
  ]);

  return NextResponse.json({
    data: {
      weekRange: {
        start: weekStart.toISOString(),
        end: new Date(weekEnd.getTime() - 1).toISOString(),
      },
      weeklyTrainings: (weeklyTrainings as TrainingListItem[]).map(mapTraining),
      upcoming30Days: (upcoming30Days as TrainingListItem[]).map(mapTraining),
      scope,
    },
    error: null,
  });
});