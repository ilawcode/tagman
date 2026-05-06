import { statusBadgeClass, statusLabel, type DashboardTrainingStatus } from "@/components/features/dashboard/statusBadge";

type MonthViewItem = {
  _id: string;
  subject: string;
  date: string;
  status: DashboardTrainingStatus;
};

type MonthViewProps = {
  items: MonthViewItem[];
  year: number;
  month: number;
};

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(date);
}

export function MonthView({ items, year, month }: MonthViewProps) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingOffset = (firstDay.getDay() + 6) % 7;

  const trainingsByDay = new Map<number, MonthViewItem[]>();
  for (const training of items) {
    const d = new Date(training.date);
    if (d.getFullYear() !== year || d.getMonth() !== month) {
      continue;
    }

    const day = d.getDate();
    const current = trainingsByDay.get(day) ?? [];
    current.push(training);
    trainingsByDay.set(day, current);
  }

  const cells: Array<number | null> = [];
  for (let i = 0; i < leadingOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
        {Array.from({ length: 7 }).map((_, index) => {
          const d = new Date(2026, 0, 5 + index);
          return (
            <div key={index} className="text-center font-medium">
              {dayLabel(d)}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="min-h-24 rounded-md border border-dashed border-border" />;
          }

          const dayItems = trainingsByDay.get(day) ?? [];

          return (
            <div key={day} className="min-h-24 rounded-md border border-border p-1.5 space-y-1 overflow-hidden">
              <p className="text-xs font-semibold">{day}</p>
              {dayItems.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">-</p>
              ) : (
                <ul className="space-y-1">
                  {dayItems.slice(0, 2).map((training) => (
                    <li key={training._id} className="text-[11px] leading-4">
                      <span
                        className={`inline-flex rounded px-1.5 py-0.5 font-medium ${statusBadgeClass[training.status]} ${
                          training.status === "cancelled" ? "ring-1 ring-[#ef4444]" : ""
                        }`}
                        title={statusLabel[training.status]}
                      >
                        {training.subject}
                      </span>
                    </li>
                  ))}
                  {dayItems.length > 2 ? <li className="text-[11px] text-muted-foreground">+{dayItems.length - 2} daha</li> : null}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}