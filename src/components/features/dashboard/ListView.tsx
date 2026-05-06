import { statusBadgeClass, statusLabel, type DashboardTrainingStatus } from "@/components/features/dashboard/statusBadge";

type ListViewItem = {
  _id: string;
  subject: string;
  date: string;
  status: DashboardTrainingStatus;
};

type ListViewProps = {
  items: ListViewItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function ListView({ items }: ListViewProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Bu görünüm icin eğitim kaydı yok.</p>;
  }

  return (
    <div className="rounded-lg border border-border divide-y divide-border">
      {items.map((training) => (
        <div
          key={training._id}
          className={`px-3 py-2 flex items-center justify-between gap-3 ${
            training.status === "cancelled" ? "bg-[#fef2f2]" : ""
          }`}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{training.subject}</p>
            <p className="text-xs text-muted-foreground">{formatDate(training.date)}</p>
            {training.status === "cancelled" ? <p className="text-xs text-[#b91c1c] font-semibold">İPTAL EDİLDİ</p> : null}
          </div>
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass[training.status]}`}>
            {statusLabel[training.status]}
          </span>
        </div>
      ))}
    </div>
  );
}