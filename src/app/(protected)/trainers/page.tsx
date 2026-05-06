import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Trainer } from "@/models/Trainer";

type TrainerListItem = {
  _id: string;
  firstName: string;
  lastName: string;
  employmentType: "internal" | "external";
  isActive: boolean;
};

type TrainerListItemRaw = Omit<TrainerListItem, "_id"> & {
  _id: { toString(): string } | string;
};

type TrainersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrainersPage({ searchParams }: TrainersPageProps) {
  const params = await searchParams;
  const showAll = params?.showAll === "1";

  await connectDB();
  const trainersRaw = (await Trainer.find(showAll ? {} : { isActive: true })
    .select("firstName lastName employmentType isActive")
    .sort({ firstName: 1, lastName: 1 })
    .lean()) as TrainerListItemRaw[];

  const trainers: TrainerListItem[] = trainersRaw.map((trainer) => ({
    ...trainer,
    _id: trainer._id.toString(),
  }));

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Eğitmenler</h1>
        <div className="flex items-center gap-2">
          <Link href={showAll ? "/trainers" : "/trainers?showAll=1"} className="text-sm underline">
            {showAll ? "Sadece Aktifleri Göster" : "Pasifleri de Göster"}
          </Link>
          <Link
            href="/trainers/new"
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
          >
            Yeni Eğitmen
          </Link>
        </div>
      </header>

      {trainers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Gösterilecek eğitmen bulunamadı.</p>
      ) : (
        <div className="rounded-lg border border-border divide-y divide-border">
          {trainers.map((trainer) => (
            <Link
              key={trainer._id}
              href={`/trainers/${trainer._id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/30"
            >
              <div>
                <p className="font-medium">
                  {trainer.firstName} {trainer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {trainer.employmentType === "internal" ? "Kurum içi" : "Kurum dışı"}
                </p>
              </div>
              {!trainer.isActive ? (
                <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-[#fee2e2] text-[#991b1b]">
                  Pasif
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
