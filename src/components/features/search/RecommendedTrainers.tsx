type RecommendedTrainerItem = {
  _id: string;
  firstName: string;
  lastName: string;
  matchedSkills: string[];
  averageScore: number | null;
};

type RecommendedTrainersProps = {
  items: RecommendedTrainerItem[];
  loading: boolean;
  queryDurationMs: number | null;
  onPick: (trainerId: string) => void;
};

export function RecommendedTrainers({ items, loading, queryDurationMs, onPick }: RecommendedTrainersProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 space-y-3">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Onerilen Eğitmenler</h3>
        {queryDurationMs !== null ? (
          <span className="text-xs text-muted-foreground">Sorgu: {queryDurationMs}ms</span>
        ) : null}
      </header>

      {loading ? <p className="text-sm text-muted-foreground">Oneriler yükleniyor...</p> : null}

      {!loading && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Bu konu ve tarih icin uygun eğitmen onerisi bulunamadı.</p>
      ) : null}

      {!loading && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((trainer) => (
            <li
              key={trainer._id}
              className="rounded-md border border-border px-3 py-2 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {trainer.firstName} {trainer.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ortalama Puan: {trainer.averageScore !== null ? trainer.averageScore.toFixed(1) : "-"}
                </p>
                {trainer.matchedSkills.length > 0 ? (
                  <p className="text-xs text-muted-foreground truncate">
                    Eslesen skilller: {trainer.matchedSkills.join(", ")}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onPick(trainer._id)}
                className="rounded-md border border-primary px-3 py-1.5 text-xs font-semibold"
              >
                Oneriyi Sec
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}