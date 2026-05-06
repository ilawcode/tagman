import Link from "next/link";
import { TrainingsList } from "@/components/features/trainings/TrainingsList";
import { connectDB } from "@/lib/db";
import { Training } from "@/models/Training";

type TrainingListItem = {
  _id: { toString(): string };
  subject: string;
  date: Date;
  status: "planned" | "cancelled" | "completed";
  cancelNote?: string;
  completionScore?: number;
};

export default async function TrainingsPage() {
  await connectDB();

  const trainings = (await Training.find({})
    .select("subject date status cancelNote completionScore")
    .sort({ date: -1 })
    .lean()) as TrainingListItem[];

  const trainingsView = trainings.map((training) => ({
    _id: training._id.toString(),
    subject: training.subject,
    date: training.date.toISOString(),
    status: training.status,
    cancelNote: training.cancelNote,
    completionScore: training.completionScore,
  }));

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Eğitimler</h1>
        <Link
          href="/trainings/new"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
        >
          Yeni Eğitim
        </Link>
      </header>

      {trainings.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz eğitim oluşturulmamis.</p>
      ) : (
        <TrainingsList initialTrainings={trainingsView} />
      )}
    </section>
  );
}
