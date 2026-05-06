"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TrainerBarChart } from "@/components/features/trainers/TrainerBarChart";
import { useTrainerStats } from "@/hooks/useTrainerStats";

type TrainerSkillView = {
  skill?: {
    _id?: string;
    name?: string;
  };
  score: number;
};

type TrainerView = {
  _id: string;
  firstName: string;
  lastName: string;
  employmentType: "internal" | "external";
  consultingFirm?: string;
  biography: string;
  isActive: boolean;
  skills: TrainerSkillView[];
};

export default function TrainerProfilePage() {
  const params = useParams<{ id: string }>();
  const trainerId = params.id;

  const [trainer, setTrainer] = useState<TrainerView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statsQuery = useTrainerStats(trainerId ?? "");

  useEffect(() => {
    let cancelled = false;

    const fetchTrainer = async () => {
      const response = await fetch(`/api/trainers/${trainerId}`, { cache: "no-store" });
      const result = await response.json();

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setError(result?.error?.message ?? "Eğitmen bulunamadı");
        setLoading(false);
        return;
      }

      setTrainer(result?.data?.trainer as TrainerView);
      setLoading(false);
    };

    void fetchTrainer();

    return () => {
      cancelled = true;
    };
  }, [trainerId]);

  const averageScoreLabel = useMemo(() => {
    const average = statsQuery.data?.averageScore;
    if (average === null || average === undefined) {
      return "-";
    }

    return average.toFixed(1);
  }, [statsQuery.data?.averageScore]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Yükleniyor...</p>;
  }

  if (error || !trainer) {
    return <p className="text-sm text-destructive">{error ?? "Eğitmen bulunamadı"}</p>;
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            {trainer.firstName} {trainer.lastName}
          </h1>
          {!trainer.isActive ? (
            <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-[#fee2e2] text-[#991b1b]">
              Pasif
            </span>
          ) : null}
        </div>
        <Link href={`/trainers/${trainerId}/edit`} className="text-sm underline">
          Düzenle
        </Link>
      </header>

      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <p>
          <span className="font-medium">Kurum Durumu:</span>{" "}
          {trainer.employmentType === "internal" ? "Kurum içi" : "Kurum dışı"}
        </p>
        {trainer.consultingFirm ? (
          <p>
            <span className="font-medium">Danışmanlık Firmasi:</span> {trainer.consultingFirm}
          </p>
        ) : null}
        <p>
          <span className="font-medium">Özgeçmiş:</span> {trainer.biography}
        </p>
        <div>
          <p className="font-medium mb-1">Skilller:</p>
          {trainer.skills && trainer.skills.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {trainer.skills.map((entry, index: number) => (
                <li key={`${index}-${entry.skill?._id || "skill"}`}>
                  {entry.skill?.name || "Bilinmeyen skill"} - Puan: {entry.score}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Henüz skill atanmamis.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <article className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm text-muted-foreground">Ortalama Puan</h2>
          <p className="text-3xl font-semibold mt-1">{averageScoreLabel}</p>
        </article>

        <article className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm text-muted-foreground mb-2">Yıllık Eğitim Sayısi</h2>
          {statsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Istatistik yükleniyor...</p>
          ) : (
            <TrainerBarChart data={statsQuery.data?.trainingCountByYear ?? []} />
          )}
        </article>
      </div>
    </section>
  );
}
