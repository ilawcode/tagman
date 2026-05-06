import { statusBadgeClass, statusLabel, type DashboardTrainingStatus } from "@/components/features/dashboard/statusBadge";

type CardViewItem = {
  _id: string;
  subject: string;
  date: string;
  status: DashboardTrainingStatus;
};

type CardViewProps = {
  items: CardViewItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function CardView({ items }: CardViewProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Bu görünüm icin eğitim kaydı yok.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((training) => (
        <article
          key={training._id}
          className={`rounded-lg border p-3 space-y-2 ${
            training.status === "cancelled" ? "border-[#ef4444] bg-[#fef2f2]" : "border-border bg-card"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-5">{training.subject}</h3>
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass[training.status]}`}>
              {statusLabel[training.status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Tarih: {formatDate(training.date)}</p>
          {training.status === "cancelled" ? <p className="text-xs font-semibold text-[#b91c1c]">İPTAL EDİLDİ</p> : null}
        </article>
      ))}
    </div>
  );
}