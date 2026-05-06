import { MonthView } from "@/components/features/dashboard/MonthView";
import { type DashboardTrainingStatus } from "@/components/features/dashboard/statusBadge";

type CalendarViewItem = {
  _id: string;
  subject: string;
  date: string;
  status: DashboardTrainingStatus;
};

type CalendarViewProps = {
  items: CalendarViewItem[];
  referenceDate?: string;
};

export function CalendarView({ items, referenceDate }: CalendarViewProps) {
  const anchor = referenceDate ? new Date(referenceDate) : new Date();
  const year = anchor.getFullYear();
  const month = anchor.getMonth();

  const monthLabel = new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold capitalize">{monthLabel}</h3>
      <MonthView items={items} year={year} month={month} />
    </section>
  );
}