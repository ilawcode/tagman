"use client";

import { useMemo, useState } from "react";
import { CalendarView } from "@/components/features/dashboard/CalendarView";
import { CardView } from "@/components/features/dashboard/CardView";
import { ListView } from "@/components/features/dashboard/ListView";
import { statusBadgeClass, statusLabel } from "@/components/features/dashboard/statusBadge";
import { useDashboard } from "@/hooks/useDashboard";

type ViewMode = "calendar" | "list" | "card";
type ScopeMode = "all" | "mine";

const DASHBOARD_SCOPE_KEY = "dashboard-scope";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [scope, setScope] = useState<ScopeMode>(() => {
    if (typeof window === "undefined") {
      return "all";
    }

    const stored = sessionStorage.getItem(DASHBOARD_SCOPE_KEY);
    return stored === "mine" ? "mine" : "all";
  });
  const dashboardQuery = useDashboard(scope);

  const changeScope = (nextScope: ScopeMode) => {
    setScope(nextScope);
    sessionStorage.setItem(DASHBOARD_SCOPE_KEY, nextScope);
  };

  const weekLabel = useMemo(() => {
    if (!dashboardQuery.data) {
      return "";
    }

    return `${formatDate(dashboardQuery.data.weekRange.start)} - ${formatDate(dashboardQuery.data.weekRange.end)}`;
  }, [dashboardQuery.data]);

  if (dashboardQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Dashboard yükleniyor...</p>;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <p className="text-sm text-destructive">Dashboard verisi alinamadi.</p>;
  }

  const { weeklyTrainings, upcoming30Days } = dashboardQuery.data;

  const viewButtonClass = (mode: ViewMode) =>
    `rounded-md border px-3 py-1.5 text-xs font-semibold ${
      viewMode === mode ? "border-primary bg-primary text-primary-foreground" : "border-border"
    }`;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bu hafta ve sonraki 30 gunun eğitim ozetini görüntüleyin.</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeScope("all")}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
              scope === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            Tüm Akademi
          </button>
          <button
            type="button"
            onClick={() => changeScope("mine")}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
              scope === "mine" ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            Benim Eğitimlerim
          </button>
        </div>
      </header>

      <article className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Bu Haftanin Eğitimleri</h2>
          <span className="text-xs text-muted-foreground">{weekLabel}</span>
        </div>

        {weeklyTrainings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bu hafta icin planlı eğitim bulunmuyor.</p>
        ) : (
          <ul className="space-y-2">
            {weeklyTrainings.map((training) => (
              <li
                key={training._id}
                className={`rounded-md border px-3 py-2 flex items-center justify-between gap-3 ${
                  training.status === "cancelled"
                    ? "border-[#ef4444] bg-[#fef2f2]"
                    : "border-[#f59e0b] bg-[#fffbeb]"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{training.subject}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(training.date)}</p>
                  {training.status === "cancelled" ? (
                    <p className="text-xs font-semibold text-[#b91c1c]">İPTAL EDİLDİ</p>
                  ) : null}
                </div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass[training.status]}`}>
                  {statusLabel[training.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h2 className="text-lg font-semibold">Sonraki 30 Gun</h2>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setViewMode("calendar")} className={viewButtonClass("calendar")}>
            Takvim
          </button>
          <button type="button" onClick={() => setViewMode("list")} className={viewButtonClass("list")}>
            Liste
          </button>
          <button type="button" onClick={() => setViewMode("card")} className={viewButtonClass("card")}>
            Kart
          </button>
        </div>

        {upcoming30Days.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sonraki 30 gun icin eğitim kaydı bulunmuyor.</p>
        ) : (
          <>
            {viewMode === "calendar" ? (
              <CalendarView items={upcoming30Days} referenceDate={upcoming30Days[0]?.date} />
            ) : null}
            {viewMode === "list" ? <ListView items={upcoming30Days} /> : null}
            {viewMode === "card" ? <CardView items={upcoming30Days} /> : null}
          </>
        )}
      </article>
    </section>
  );
}
